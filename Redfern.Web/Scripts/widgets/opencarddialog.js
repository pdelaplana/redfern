function OpenCardDialog (elementId, data){

    function CommentListItem(data) {
        var self = this;
        self.comment = ko.observable(data.Comment);
        self.commentByUser = ko.observable(data.CommentByUser);
        self.commentByUserFullName = ko.observable(data.CommentByUserFullName);
        self.commentDate = ko.observable(data.CommentDate);
    }

    var elementId = elementId,
        data = data,
        self = this;

    self.data = data;

    self.newComment = ko.observable();
    self.comments = ko.observableArray();

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
        var repository = new CardCommentRepository();
        repository.cardId(self.data.cardId());
        repository.comment(self.newComment());
        repository.create().done(function (result) {
            self.comments.splice(0, 0, new CommentListItem(result));
            self.newComment('');
            self.data.commentCount(self.comments().length);
        });
    }

    self.loadComments = function () {
        var repository = new CardCommentRepository();
        repository.cardId(self.data.cardId());
        repository.getComments().done(function (result) {
            $.each(result, function (index, value) {
                self.comments.push(new CommentListItem(value));
            })
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
                    ko.applyBindings(self, $(dialog).get(0));
                }
            });
        }
    }

}