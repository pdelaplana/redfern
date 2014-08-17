function CommentListItem(data) {
    var self = this;
    self.boardId = ko.observable(data.boardId);
    self.cardId = ko.observable(data.cardId);
    self.commentId = ko.observable(data.commentId);
    self.comment = ko.observable(data.comment);
    self.commentByUser = ko.observable(data.commentByUser);
    self.commentByUserFullName = ko.observable(data.commentByUserFullName);
    self.commentDate = ko.observable(data.commentDate);
    self.commentDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.commentDate()).toDate()).format('llll');
    })
    self.commentDateFromNow = ko.computed(function () {
        return moment.utc(self.commentDate()).fromNow();
    })
    self.editing = ko.observable(false);
}

function ActivityListItem(data) {
    var self = this;
    self.activityId = ko.observable(data.activityId);
    self.actorId = ko.observable(data.actorId);
    self.actorDisplayName = ko.observable(data.actorDisplayName);
    self.activityDate = ko.observable(data.activityDate);
    self.verb = ko.observable(data.verb);
    self.objectDisplayName = ko.observable(data.objectDisplayName);
    self.sourceDisplayName = ko.observable(data.sourceDisplayName);
    self.targetDisplayName = ko.observable(data.targetDisplayName);

    self.description = ko.computed(function () {
        var description = "";
        switch (self.verb()) {
            case "moved":
                description = "<b>" + self.actorDisplayName() + "</b> moved this card from <b>" + self.sourceDisplayName() + "</b> to <b>" + self.targetDisplayName() + "</b>."
                break;
            case "added":
                description = "<b>" + self.actorDisplayName() + "</b> added this card to <b>" + self.targetDisplayName() + "</b>."
                break;
            default:
                description = "<b>" + self.actorDisplayName() + "</b>  " + self.verb() + " this card.";
                break;
        }
        return description;
    });

    self.activityDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.activityDate()).toDate()).format('llll');
    })
}

function AttachmentListItem(data) {
    var self = this;
    self.cardAttachmentId = ko.observable(data.cardAttachmentId);
    self.fileName = ko.observable(data.fileName);
    self.uploadDate = ko.observable(data.uploadDate);
    self.uploadedByUserFullName = ko.observable(data.uploadedByUserFullName);
    self.uploadDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.uploadDate()).toDate()).format('llll');
    })
    self.uploadDateFromNow = ko.computed(function () {
        return moment.utc(self.uploadDate()).fromNow();
    })
}

function CardPropertiesDialog(elementId, source) {

    
    var elementId = elementId,
        self = this;

    // properties
    self.changed = false;
    
    // mirror data source
    self.column = source.parent;
    self.cardId = source.cardId;
    self.boardId = source.boardId;
    self.title = source.title;
    self.description = source.description;
    self.createdByUserFullName = source.createdByUserFullName;
    self.createdDate = source.createdDate;
    self.assignedToUser = source.assignedToUser;
    self.assignedToUserFullName = source.assignedToUserFullName;
    self.dueDate = source.dueDate;
    self.cardTypeId = source.cardTypeId;
    self.color = source.color;
    self.tags = source.tags;

    self.commentCount = source.commentCount;
    self.attachmentCount = source.attachmentCount;

    self.cardTypes = source.parent.board.cardTypes;
    self.boardMembers = source.parent.board.members;
    self.boardOwner = source.parent.board.owner;
    self.boardOwnerFullName = source.parent.board.ownerFullName;
    self.columns = source.parent.board.columns;
    self.hasAccess = source.parent.board.hasAccess;

    self.assign = source.assign;
    self.archive = source.archive;
    self.update = source.update;
    self.remove = source.remove;

    self.selectedColumn = ko.observable(source.parent);

    // subscriptions

    self.selectedColumn.subscribe(function (newValue) {});


    self.title.subscribe(function (newValue) {
        self.changed = true;
    })



    self.isAssigned = ko.computed(function () {
        return (self.assignedToUser() != null) && (self.assignedToUser().length > 0);
    })

    self.assignee = ko.computed(function () {
        return self.assignedToUserFullName() || 'Unassigned';
    })
    
    self.changeColor = function (newColor) {
        var repository = new CardRepository();
        repository.cardId = self.cardId();
        repository.boardId = self.boardId();
        repository.color = newColor;
        repository.changeColor().done(function (result) {
            self.cardTypeId(result.data.cardTypeId)
            self.column.board.hub.notify.onCardColorChanged(result.data.boardId, result.data.cardId, result.data.cardTypeId, result.data.color, result.activityContext);
        })
    }

    self.tags.add = function (tag) {
        var repository = new CardTagRepository();
        repository.boardId = self.boardId();
        repository.cardId = self.cardId();
        repository.tagName = tag;
        repository.create().done(function (result) {
            $.boardcontext.current.hub.notify.onCardTagAdded(self.boardId(), self.cardId(), result.data.tagName, result.activityContext);
        });
    }

    self.tags.delete = function (tag) {
        var repository = new CardTagRepository();
        repository.boardId = self.boardId();
        repository.cardId = self.cardId();
        repository.tagName = tag;
        repository.remove().done(function (result) {
            $.boardcontext.current.hub.notify.onCardTagRemoved(self.boardId(), self.cardId(), result.data, result.activityContext);
        });
    }

    self.members = function () {
        var members = $.map(self.boardMembers(), function (value) {
            return {
                label: value.fullName(),
                value: value.fullName(),
                id: value.userName()
            }
        });
        members.splice(0, 0, {
            label: self.boardOwnerFullName(),
            value: self.boardOwnerFullName(),
            id: self.boardOwner()
        })
        return members;
    }

    self.wiki = {
        save: function () {
            var repository = new CardRepository();
            repository.boardId = self.boardId();
            repository.cardId = self.cardId();
            repository.description = self.description();
            repository.update().done(function (result) {
                $.boardcontext.current.hub.notify.onCardUpdated(result.data, result.activityContext);
            })
        }
    }

    
    self.commentThread = {
        comments: ko.observableArray(),
        newComment: ko.observable(),
        add: function () {
            if (self.commentThread.newComment() != null) {
                var repository = new CardCommentRepository();
                repository.boardId = self.boardId();
                repository.cardId = self.cardId();
                repository.comment = self.commentThread.newComment();
                repository.create().done(function (result) {
                    self.commentThread.comments.splice(0, 0, new CommentListItem(result.data));
                    self.commentThread.newComment('');
                    self.commentCount(self.commentThread.comments().length);
                    $.boardcontext.current.hub.notify.onCardCommentAdded(self.boardId(), result.data, result.activityContext);
                });
            }
        },
        remove: function (comment) {
            var repository = new CardCommentRepository();
            repository.boardId = comment.boardId();
            repository.cardId = comment.cardId();
            repository.commentId = comment.commentId();
            repository.remove().done(function (result) {
                self.commentThread.comments.remove(comment);
                self.commentCount(self.commentThread.comments().length);
                $.boardcontext.current.hub.notify.onCardCommentRemoved(comment.boardId(), comment.cardId(), comment.commentId(), result.activityContext);
            });
        },
        update: function(comment){
            var repository = new CardCommentRepository();
            repository.boardId = comment.boardId();
            repository.cardId = comment.cardId();
            repository.commentId = comment.commentId();
            repository.comment = comment.comment();
            repository.update().done(function (result) {
                $.boardcontext.current.hub.notify.onCardCommentUpdated(result.data.boardId, result.data, result.activityContext);
            });
        },
        loading: ko.observable(true),
        load: function () {
            var repository = new CardCommentRepository();
            repository.boardId = self.boardId();
            repository.cardId = self.cardId();
            repository.getComments().done(function (result) {
                $.each(result, function (index, value) {
                    self.commentThread.comments.push(new CommentListItem(value));
                })
                self.commentThread.loading(false);
            });
        }
    }


    self.activityStream = {
        activities: ko.observableArray(),
        loading: ko.observable(true),
        load: function () {
            var repository = new CardActivityRepository();
            repository.cardId(self.cardId());
            repository.getList().done(function (result) {
                $.each(result, function (index, value) {
                    self.activityStream.activities.push(new ActivityListItem(value));
                })
                self.activityStream.loading(false);
            })
        }
    }

    self.attachmentsList = {
        attachments : ko.observableArray(),
        load: function () {
            var repository = new CardAttachmentRepository();
            repository.cardId = self.cardId();
            repository.getAll().done(function (result) {
                $.each(result, function (index, value) {
                    self.attachmentsList.attachments.push(new AttachmentListItem(value));
                })
               
            })
        },
        remove: function (attachment) {
            var repository = new CardAttachmentRepository();
            repository.cardId = self.cardId(),
            repository.cardAttachmentId = attachment.cardAttachmentId();
            repository.remove().done(function (result) {
                self.column.board.hub.notify.onCardAttachmentRemoved(self.boardId(), self.cardId(), attachment.cardAttachmentId(), result.activityContext);
                self.attachmentsList.attachments.remove(attachment);
                self.attachmentCount(self.attachmentsList.attachments().length);
            });
        }
    }

    self.setDueDate = function () {
        var repository = new CardRepository();
        repository.boardId = self.boardId();
        repository.cardId = self.cardId();
        repository.dueDate = self.dueDate() != null ? self.dueDate().toJSON() : null;
        repository.changeDueDate().done(function (result) {
            $.boardcontext.current.hub.notify.onCardDueDateChanged(self.boardId(), result.data.cardId, result.data.dueDate, result.activityContext);
        });
    }

    self.assignCard = function (userName) {
        self.assignedToUser(userName);
        self.assign();
    }

    self.removeCard = function () {
        self.remove().done(function () {
            self.changed = false;
            $.Dialog.close();
        })
    }

    self.archiveCard = function () {
        $.Dialog.close();
        self.archive().done(function () {
            self.changed = false;
        });
    }

    self.moveCard = function () {
        var targetColumn = ko.utils.arrayFirst(self.columns(), function (column) {
            return column.columnId() == self.selectedColumn().columnId();
        });

        if (targetColumn != null) {

            // move the card
            var clonedCard = self.column.cards.remove(function (card) { return card.cardId() == self.cardId(); })[0];
            if (clonedCard == null) return;
            clonedCard.parent = targetColumn;
            clonedCard.sequence(targetColumn.cards().length);
            clonedCard.show(true);
            targetColumn.cards.push(clonedCard);

            // send the update 
            var repository = new CardRepository();
            repository.boardId = self.boardId();
            repository.cardId = self.cardId();
            repository.columnId = targetColumn.columnId();
            repository.resequence(targetColumn.cards.getArrayOfProperty('cardId'))
                .done(function (result) {
                    targetColumn.board.hub.notify.onCardMoved(result.data, result.activityContext);
                });
        }

    }

    self.userPhotoUrl = function () {

        var assignedToUser = self.assignedToUser();
        
        if (assignedToUser == null || assignedToUser.length == 0) {
            assignedToUser = 'unknown';
        } 
        return '/api/avatar/' + assignedToUser + '?height=35'    
        
    }

    self.open = function () {
        var content = $(elementId).html();
        $.Dialog({
            overlay: false,
            shadow: true,
            flat: true,
            icon: false,
            title: '<strong>Card Properties</strong>',
            content: content,
            width: '85%',
            height: '92%',
            //position: { top: 50, left: 10 },
            onShow: function (dialog) {

                $('[data-role=datepicker]', dialog).datepicker();
                $('[data-role=dropdown]', dialog).dropdown();
                $('.tab-control', dialog).tabcontrol();
                $('none').dropzone({
                    url: '/api/card/'+self.cardId()+'/attachments/',
                    method:'post',
                    previewsContainer: "#previews",
                    clickable: "#uploadfile",
                    dictResponseError: 'test error',
                    init: function () {
                        this.on('addedfile', function (file) {

                        })
                        this.on('complete', function (file) {
                            this.removeFile(file);
                        })
                        this.on('success', function (file, result) {
                            self.attachmentsList.attachments.splice(0, 0, new AttachmentListItem(result.data));
                            self.attachmentCount(self.attachmentsList.attachments().length);
                            self.column.board.hub.notify.onCardAttachmentAdded(self.boardId(), result.data, result.activityContext);
                        })
                    },
                });
                $('#options',dialog).click(function (event) {
                    $('#options',dialog).popModal({
                        html: $('#optionsContent').html(),
                        placement: 'bottomRight',
                        showCloseBut: true,
                        onDocumentClickClose: true,
                        onOkBut: function () { },
                        onCancelBut: function () { },
                        onLoad: function () { },
                        onClose: function () { }
                    });
                    event.preventDefault();
                    event.stopPropagation();

                })
                $('#ChangeColumn', dialog).click(function (event) {
                    $('#ChangeColumn', dialog).popModal({
                        html: $('#ChangeParentColumn').html(),
                        placement: 'bottomLeft',
                        showCloseBut: true,
                        onDocumentClickClose: true,
                        onOkBut: function () { },
                        onCancelBut: function () { },
                        onLoad: function () { },
                        onClose: function () { }
                    });
                    event.preventDefault();
                    event.stopPropagation();

                })

                self.commentThread.load();
                self.activityStream.load();
                self.attachmentsList.load();

                
                ko.applyBindings(self, $(dialog).get(0));

                // set address bar location
                app.router.go('#/board/' + $.boardcontext.current.boardId() + '/card/' + self.cardId());

            },
            onClose: function () {
                if (self.changed)
                    self.update();

                // set address bar location
                app.router.go('#/board/' + $.boardcontext.current.boardId());
                
            },
            onResize: function (dialog) {
                //var height = $(dialog).height() - 180;
                //$('.content', dialog).height($(dialog).height());
                //$('.tab-control .frames', dialog).height(height)
            }
        });
    }

    
}