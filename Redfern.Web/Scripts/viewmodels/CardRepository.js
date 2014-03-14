function CardRepository() {
    var self = this;

    self.cardId = ko.observable();
    self.title = ko.observable();
    self.boardId = ko.observable();
    self.columnId = ko.observable();
    self.sequence = ko.observable();

    self.create = function () {
        return $.ajax({
            url: '/api/card',
            type: 'post',
            data: {
                BoardId: self.boardId(),
                ColumnId: self.columnId(),
                Title: self.title(),
                Sequence: self.sequence()
            }
        });
    }
}