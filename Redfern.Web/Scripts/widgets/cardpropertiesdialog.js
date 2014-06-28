function CardPropertiesDialog(elementId, source) {

    function CommentListItem(data) {
        var self = this;
        self.commentId = ko.observable(data.CommentId);
        self.comment = ko.observable(data.Comment);
        self.commentByUser = ko.observable(data.CommentByUser);
        self.commentByUserFullName = ko.observable(data.CommentByUserFullName);
        self.commentDate = ko.observable(data.CommentDate);
        self.commentDateInLocalTimezone = ko.computed(function () {
            return moment(moment.utc(self.commentDate()).toDate()).format('llll');
        })
        self.commentDateFromNow = ko.computed(function () {
            return moment.utc(self.commentDate()).fromNow();
        })
    }

    function ActivityListItem(data) {
        var self = this;
        self.activityId = ko.observable(data.ActivityId);
        self.actorId = ko.observable(data.ActorId);
        self.actorDisplayName = ko.observable(data.ActorDisplayName);
        self.activityDate = ko.observable(data.ActivityDate);
        self.verb = ko.observable(data.Verb);
        self.objectDisplayName = ko.observable(data.ObjectDisplayName);
        self.sourceDisplayName = ko.observable(data.SourceDisplayName);
        self.targetDisplayName = ko.observable(data.TargetDisplayName);

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
        self.cardAttachmentId = ko.observable(data.CardAttachmentId);
        self.fileName = ko.observable(data.FileName);
        self.uploadDate = ko.observable(data.UploadDate);
        self.uploadedByUserFullName = ko.observable(data.uploadedByUserFullName);
        self.uploadDateInLocalTimezone = ko.computed(function () {
            return moment(moment.utc(self.uploadDate()).toDate()).format('llll');
        })
        self.uploadDateFromNow = ko.computed(function () {
            return moment.utc(self.uploadDate()).fromNow();
        })
    }

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

    self.selectedColumn.subscribe(function (newValue) {

      
       
    });


    self.title.subscribe(function (newValue) {
        self.changed = true;
    })

    self.assignedToUser.subscribe(function (newValue) {
        self.assign().done(function () {
            self.assignedToUserFullName();
        });
    })

    self.color.subscribe(function (newValue) {
        var cardType = ko.utils.arrayFirst(self.cardTypes(), function (cardType) {
            return cardType.color() == newValue;
        });
        self.cardTypeId(cardType.cardTypeId());
        self.changed = true;
    });

    self.tags.subscribe(function (changes) {

        $.each(changes, function (index, change) {
            if (change.status == 'added') {
                var repository = new CardTagRepository();
                repository.cardId(self.cardId());
                repository.tagName(change.value);
                repository.create().done(function () {
                    //self.tags.push(tagName);
                });

            } else if (change.status == 'deleted') {
                var repository = new CardTagRepository();
                repository.cardId(self.cardId());
                repository.tagName(change.value);
                repository.remove().done(function () {
                    //self.tags.pop(tagName)
                });
            }
        })
        
    }, null, "arrayChange")

    
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
            repository.cardId(self.cardId());
            repository.description(self.description());
            repository.update().done(function () {
                
            })
        }
    }

    
    self.commentThread = {
        comments: ko.observableArray(),
        newComment: ko.observable(),
        add: function () {
            if (self.commentThread.newComment() != null) {
                var repository = new CardCommentRepository();
                repository.cardId(self.cardId());
                repository.comment(self.commentThread.newComment());
                repository.create().done(function (result) {
                    self.commentThread.comments.splice(0, 0, new CommentListItem(result));
                    self.commentThread.newComment('');
                    self.commentCount(self.commentThread.comments().length);
                });
            }
        },
        remove: function (comment) {
            var repository = new CardCommentRepository();
            repository.commentId(comment.commentId());
            repository.remove().done(function () {
                self.commentThread.comments.remove(comment);
                self.commentCount(self.commentThread.comments().length);
            });
        },
        loading: ko.observable(true),
        load: function () {
            var repository = new CardCommentRepository();
            repository.cardId(self.cardId());
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
            repository.cardId(self.cardId());
            repository.getAll().done(function (result) {
                $.each(result, function (index, value) {
                    self.attachmentsList.attachments.push(new AttachmentListItem(value));
                })
            })
        },
        remove: function (attachment) {
            var repository = new CardAttachmentRepository();
            repository.cardAttachmentId(attachment.cardAttachmentId());
            repository.remove().done(function () {
                self.attachmentsList.attachments.remove(attachment);
                self.attachmentCount(self.attachmentsList.attachments().length);
            });
        }
    }


    self.removeCard = function () {
        $.Dialog.close();
        self.remove().done(function () {
            self.changed = false;
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
            var clonedCard = self.column.cards.remove(function (card) { return card.cardId() == self.cardId(); })[0];
            if (clonedCard == null) return;
            clonedCard.parent = targetColumn;
            clonedCard.sequence(targetColumn.cards().length);
            clonedCard.show(true);
            targetColumn.cards.push(clonedCard);

            var ids = new Array();
            $.each(targetColumn.cards(), function (index, value) {
                ids.push(value.cardId());
            })
            $.ajax({
                url: '/api/card',
                type: 'resequence',
                data: {
                    ColumnId: targetColumn.columnId(),
                    CardIds: ids
                },
                success: function () {
                    //self.columnName(targetColumn.name());
                    //self.column

                }
            });
        }


    }

    self.userPhotoUrl = function () {
        var assignedToUser = self.assignedToUser();
        if (assignedToUser != null && assignedToUser.length > 0) {
            return '/api/avatar/'+assignedToUser+'?height=25'
        } else {
            return '/content/images/grey-box.png';
        }
        
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
            width: '70%',
            height: '92%',
            //position: { top: 50, left: 10 },
            onShow: function (dialog) {

                
                $('[data-role=datepicker]', dialog).datepicker();
                $('[data-role=dropdown]', dialog).dropdown();
                $('.tab-control', dialog).tabcontrol();
                $(dialog).dropzone({
                    url: '/api/cardattachment/' + self.cardId(),
                    previewsContainer: "#previews",
                    clickable: "#uploadfile",
                    dictResponseError: 'test error',
                    init: function () {
                        this.on('addedfile', function (file) {

                        })
                        this.on('complete', function (file) {
                            this.removeFile(file);
                        })
                        this.on('success', function (file, response) {
                            self.attachmentsList.attachments.splice(0, 0, new AttachmentListItem(response));
                            self.attachmentCount(self.attachmentsList.attachments().length);
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

                // if description is empty , open for editing
                //if (self.description() == null || self.description() == '')
                //    self.wiki.editing(true);

                ko.applyBindings(self, $(dialog).get(0));

            },
            onClose: function () {
                if (self.changed)
                    self.update();
            },
            onResize: function (dialog) {
                //var height = $(dialog).height() - 180;
                //$('.content', dialog).height($(dialog).height());
                //$('.tab-control .frames', dialog).height(height)
            }
        });
    }

    
}