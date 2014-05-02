function CardRepository() {
    var self = this;

    self.cardId = ko.observable();
    self.title = ko.observable();
    self.description = ko.observable();
    self.boardId = ko.observable();
    self.columnId = ko.observable();
    self.sequence = ko.observable();
    self.color = ko.observable();
    self.cardTypeId = ko.observable();
    self.assignedToUser = ko.observable();
    self.dueDate = ko.observable();

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

    self.update = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'put',
            data: {
                CardId: self.cardId(),
                Title: self.title(),
                Description: self.description(),
                CardTypeId: self.cardTypeId(),
                AssignedToUser: self.assignedToUser(),
                DueDate : self.dueDate()
            }
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'delete'
        });
    }

    self.archive = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'archive'
        });
    }

    self.unarchive = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'unarchive'
        });
    }

    self.assign = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'assign',
            data: {
                CardId: self.cardId(),
                AssignedToUser : self.assignedToUser()
            }
        });
    }


}