function BoardColumnRepository() {
    var apiUrl = '/api/boardcolumn',
        self = this;

    self.boardId = ko.observable();
    self.columnId = ko.observable();
    self.name = ko.observable();
    self.sequence = ko.observable();
    self.hidden = ko.observable();
    self.expanded = ko.observable();

    self.hide = function () { }

    self.show = function () { }

    self.move = function () { }

    self.create = function () {
        return $.ajax({
            url: apiUrl,
            type: 'post',
            data: {
                BoardId: self.boardId(),
                Name: self.name(),
                Sequence: self.sequence()
            }
        });
    }
}