function CardTagRepository() {
    var apiUrl = '/api/board/{0}/card/{1}/tags'
        self = this;

    self.boardId = null;
    self.cardId = null;
    self.tagName = null;

    self.create = function () {
        return $.ajax({
            url: apiUrl.format(self.boardId, self.cardId),
            type: 'post',
            data: {
                CardId: self.cardId,
                TagName: self.tagName
            }
        });
    }

    self.remove = function () {
        return $.ajax({
            url: apiUrl.format(self.boardId, self.cardId),
            type: 'delete',
            data: {
                CardId: self.cardId,
                TagName: self.tagName
            }
        });
    }

}