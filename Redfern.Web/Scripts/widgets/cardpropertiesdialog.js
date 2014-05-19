function CardPropertiesDialog(elementId, data) {

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
        data = data,
        self = this;

    self.changed = false;
    self.data = data;

    self.data.title.subscribe(function (newValue) {
        self.changed = true;
    })

    self.data.assignedToUser.subscribe(function (newValue) {
        self.data.assign();
    })

    self.data.color.subscribe(function (newValue) {
        var cardType = ko.utils.arrayFirst(self.cardTypes(), function (cardType) {
            return cardType.color() == newValue;
        });
        self.data.cardTypeId(cardType.cardTypeId());
        self.changed = true;
    })
    
    self.cardTypes = data.parent.board.cardTypes;

    self.members = function () {
        var members = $.map(self.data.parent.board.members(), function (value) {
            return {
                label: value.fullName(),
                value: value.fullName(),
                id: value.userName()
            }
        });
        members.splice(0, 0, {
            label: self.data.parent.board.ownerFullName(),
            value: self.data.parent.board.ownerFullName(),
            id: self.data.parent.board.owner()
        })
        return members;
    }

    self.wiki = {
        editing: ko.observable(false),
        save: function () {
            var repository = new CardRepository();
            repository.cardId(self.data.cardId());
            repository.description(self.data.description());
            repository.update().done(function () {
                self.wiki.editing(false);
            })
        }
    }

    self.tags = {
        add: function (tagName) {
            var repository = new CardTagRepository();
            repository.cardId(data.cardId());
            repository.tagName(tagName);
            repository.create().done(function () {
                data.tags.push(tagName);
            });

        },
        remove : function (tagName) {
            var repository = new CardTagRepository();
            repository.cardId(data.cardId());
            repository.tagName(tagName);
            repository.remove().done(function () {
                data.tags.pop(tagName)
            });
        }
    }

    self.commentThread = {
        comments: ko.observableArray(),
        newComment: ko.observable(),
        add: function () {
            if (self.commentThread.newComment() != null) {
                var repository = new CardCommentRepository();
                repository.cardId(self.data.cardId());
                repository.comment(self.commentThread.newComment());
                repository.create().done(function (result) {
                    self.commentThread.comments.splice(0, 0, new CommentListItem(result));
                    self.commentThread.newComment('');
                    self.data.commentCount(self.commentThread.comments().length);
                });
            }
        },
        remove: function (comment) {
            var repository = new CardCommentRepository();
            repository.commentId(comment.commentId());
            repository.remove().done(function () {
                self.commentThread.comments.remove(comment);
                self.data.commentCount(self.commentThread.comments().length);
            });
        },
        loading: ko.observable(true),
        load: function () {
            var repository = new CardCommentRepository();
            repository.cardId(self.data.cardId());
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
            repository.cardId(self.data.cardId());
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
            repository.cardId(self.data.cardId());
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
                self.data.attachmentCount(self.attachmentsList.attachments().length);
            });
        }
    }


    self.remove = function () {
        $.Dialog.close();
        self.data.remove().done(function () {
            self.changed = false;
            
        })
    }

    self.archive = function () {
        $.Dialog.close();
        self.data.archive().done(function () {
            self.changed = false;
            
        });
    }

    self.assign = function () {
        self.data.assign().done(function () {
            self.data.assignedToUserFullName();

        });
    }

    self.userPhotoUrl = function () {
        var assignedToUser = self.data.assignedToUser();
        if (assignedToUser != null && assignedToUser.length > 0) {
            return '/api/avatar/'+assignedToUser+'?height=25'
        } else {
            return '/content/images/grey-box.png';
        }
        
    }


    return {
        open: function () {
            var content = $(elementId).html();
            $.Dialog({
                overlay: false,
                shadow: true,
                flat: true,
                icon: false,
                title: '<strong>Card Properties</strong>',
                content: content,
                width: '70%',
                height: '98%',
                //position: { top: 50, left: 10 },
                onShow: function (dialog) {
                    $('[data-role=datepicker]', dialog).datepicker();
                    $('[data-role=dropdown]', dialog).dropdown();
                    $('.tab-control', dialog).tabcontrol();
                    $('#tags-container', dialog).tagit({
                        initialTags: data.tags(),
                        triggerKeys: ['enter', 'tab'],
                        tagSource: function (request, response) {
                            $.ajax({
                                url: '/api/tag/',
                                type: 'GET',
                                dataType: 'json',
                                data: { name: request.term, boardId: self.data.boardId() },
                                success: function (data) {
                                    response($.map(data, function (name, val) {
                                        return { label: name, value: name, id: val }
                                    }))
                                }
                            })
                        },
                        tagsChanged: function (tagValue, action, element) {
                            if (action == 'added') {
                                self.tags.add(tagValue);
                            } else if (action == 'popped') {
                                self.tags.remove(tagValue);
                            }
                        }
                    });
                    $('form#DropZone', dialog).dropzone({
                        url: '/api/cardattachment/' + self.data.cardId(),
                        dictResponseError: 'test error',
                        init: function () {
                            this.on('addedfile', function (file) {

                            })

                            this.on('complete', function (file) {
                                this.removeFile(file);
                            })
                            this.on('success', function (file, response) {
                                self.attachmentsList.attachments.splice(0, 0, new AttachmentListItem(response));
                            })

                        },
                    });
                    
                    self.commentThread.load();
                    self.activityStream.load();
                    self.attachmentsList.load();

                    // if description is empty , open for editing
                    if (self.data.description() == null || self.data.description() == '')
                        self.wiki.editing(true);

                    ko.applyBindings(self, $(dialog).get(0));

                },
                onClose: function () {
                    if (self.changed)
                        self.data.update();
                },
                onResize: function (dialog) {
                    var height = $(dialog).height() - 180;
                    $('.tab-control .frames', dialog).height(height)
                }
            });
        }
    }

}