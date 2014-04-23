function CardActivityRepository() {
    var self = this;
    self.cardId = ko.observable();

    self.getList = function () {
        return $.ajax({
            url: '/api/cardactivity/' + self.cardId(),
            type: 'get'
        });
    }
}