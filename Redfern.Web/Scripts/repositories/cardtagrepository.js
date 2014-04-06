function CardTagRepository() {
    var self = this;

    self.cardId = ko.observable();
    self.tagName = ko.observable();

    self.create = function () {
        return $.ajax({
            url: '/api/tag',
            type: 'post',
            data: {
                CardId: self.cardId(),
                TagName: self.tagName()
            }
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/tag',
            type: 'delete',
            data: {
                CardId: self.cardId(),
                TagName: self.tagName()
            }
        });
    }

}