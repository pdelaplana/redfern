function BoardRepository() {
    var self = this;

    self.boardId = ko.observable();
    self.name = ko.observable();

    self.create = function () {
        return $.ajax({
            url: '/api/board',
            type: 'post',
            data: { Name: self.name() }
        });
    }

    self.update = function () {
        return $.ajax({
            url: '/api/board/'+self.boardId(),
            type: 'put',
            data: { BoardId : self.boardId(), Name: self.name() }
        });
    }
    
}