function CardAttachmentRepository() {
    var self = this;
    self.cardAttachmentId = ko.observable();
    self.cardId = ko.observable();
    
    self.getAll = function () {
        return $.ajax({
            url: '/api/cardattachment/?cardid=' + self.cardId(),
            type: 'get'
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/cardattachment/'+self.cardAttachmentId(),
            type: 'delete'
        })
    }

}