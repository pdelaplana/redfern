function CardAttachmentRepository() {
    var apiUrl = '/api/card/{0}/attachments',
        self = this;
    self.cardAttachmentId = null;
    self.cardId = null;
    
    self.getAll = function () {
        return $.ajax({
            url: apiUrl.format(self.cardId),
            type: 'get'
        });
    }

    self.remove = function () {
        return $.ajax({
            url: apiUrl.format(self.cardId)+'/'+self.cardAttachmentId,
            type: 'delete'
        })
    }

}