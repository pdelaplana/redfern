function CardCommentRepository() {
    var self = this;
    self.boardId = null;
    self.cardId = null;
    self.commentId = null;
    self.comment = null;

    self.getComments = function () {
        return $.ajax({
            url: '/api/board/{0}/card/{1}/comments'.format(self.boardId, self.cardId),
            type: 'get'
        });
    }

    self.create = function () {
        return $.ajax({
            url: '/api/board/{0}/card/{1}/comments'.format(self.boardId, self.cardId),
            type: 'post',
            data: {
                CardId: self.cardId,
                Comment: self.comment
            }
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/board/{0}/card/{1}/comments/{2}'.format(self.boardId, self.cardId, self.commentId),
            type: 'delete'
        });
    }

    self.update = function () {
        return $.ajax({
            url: '/api/board/{0}/card/{1}/comments/{2}'.format(self.boardId, self.cardId, self.commentId),
            type: 'put',
            data: {
                CardCommentId: self.commentId,
                CardId: self.cardId,
                Comment: self.comment
            }
        });
    }

}