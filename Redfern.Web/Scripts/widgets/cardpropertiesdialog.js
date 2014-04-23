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

        //self.description = ko.observable(data.Description);

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

    var elementId = elementId,
        data = data,
        self = this;

    self.changed = false;
    self.data = data;

    self.data.title.subscribe(function (newValue) {
        self.changed = true;
    })
    self.data.color.subscribe(function (newValue) {
        var cardType = ko.utils.arrayFirst(self.cardTypes(), function (cardType) {
            return cardType.color() == newValue;
        });
        self.data.cardTypeId(cardType.cardTypeId());
        self.changed = true;
    })
    
    self.cardTypes = data.parent.board.cardTypes;

    self.newComment = ko.observable();
    self.comments = ko.observableArray();

    self.activities = ko.observableArray();

    self.addTag = function (tagName) {
        var repository = new CardTagRepository();
        repository.cardId(data.cardId());
        repository.tagName(tagName);
        repository.create().done(function () {
            data.tags.push(tagName);
        });
    }

    self.removeTag = function (tagName) {
        var repository = new CardTagRepository();
        repository.cardId(data.cardId());
        repository.tagName(tagName);
        repository.remove().done(function () {
            data.tags.pop(tagName)
        });
    }

    self.addComment = function () {
        if (self.newComment()!=null) {
            var repository = new CardCommentRepository();
            repository.cardId(self.data.cardId());
            repository.comment(self.newComment());
            repository.create().done(function (result) {
                self.comments.splice(0, 0, new CommentListItem(result));
                self.newComment('');
                self.data.commentCount(self.comments().length);
            });
        }
    }

    self.removeComment = function (comment) {
        var repository = new CardCommentRepository();
        repository.commentId(comment.commentId());
        repository.remove().done(function () {
            self.comments.remove(comment);
            self.data.commentCount(self.comments().length);
        });
    }

    self.loadingComments = ko.observable(true);
    self.loadComments = function () {
        var repository = new CardCommentRepository();
        repository.cardId(self.data.cardId());
        repository.getComments().done(function (result) {
            $.each(result, function (index, value) {
                self.comments.push(new CommentListItem(value));
            })
            self.loadingComments(false);
        });
    }

    self.loadingActivities = ko.observable(true);
    self.loadActivities = function () {
        var repository = new CardActivityRepository();
        repository.cardId(self.data.cardId());
        repository.getList().done(function (result) {
            $.each(result, function (index, value) {
                self.activities.push(new ActivityListItem(value));
            })
            self.loadingActivities(false);
        })
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
                width: '60%',
                height: '90%',
                //position: { top: 50, left: 10 },
                onShow: function (dialog) {
                    $('[data-role=datepicker]', dialog).datepicker();
                    $('.tab-control', dialog).tabcontrol();
                    $('#tags-container', dialog).tagit({
                        initialTags: data.tags(),
                        triggerKeys: ['enter','tab'],
                        tagSource: function (request, response) {
                            $.ajax({
                                url: '/api/tag/',
                                type: 'GET',
                                dataType: 'json',
                                data: { name: request.term },
                                success: function (data) {
                                    response($.map(data, function (name, val) {
                                        return { label: name, value: name, id: val }
                                    }))
                                }
                            })
                        },
                        tagsChanged: function (tagValue, action, element) {
                            if (action == 'added') {
                                self.addTag(tagValue);
                            } else if (action == 'popped') {
                                self.removeTag(tagValue);
                            }
                        }
                    })
                    self.loadComments();
                    self.loadActivities();
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