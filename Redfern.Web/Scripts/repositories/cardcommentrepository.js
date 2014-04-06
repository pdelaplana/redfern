function CardCommentRepository() {
    var self = this;
    self.cardId = ko.observable();
    self.comment = ko.observable();

    self.getComments = function () {
        return $.ajax({
            url: '/api/comment/' + self.cardId(),
            type: 'get'
        });
    }

    self.create = function () {
        return $.ajax({
            url: '/api/comment',
            type: 'post',
            data: {
                CardId: self.cardId(),
                Comment: self.comment()
            }
        });
    }

}