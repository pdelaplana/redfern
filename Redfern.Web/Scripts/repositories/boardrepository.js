function BoardRepository() {
    var self = this;

    self.boardId = ko.observable();
    self.name = ko.observable();
    self.isPublic = ko.observable();

    self.getBoardsOfUser = function (userName) {
        return $.ajax({
            url: '/api/board/'+userName,
            type: 'get'
        });
    }

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
    
    self.remove = function () {
        return $.ajax({
            url: '/api/board/' + self.boardId(),
            type: 'delete'
        });
    }

    self.changeVisibility = function () {
        return $.ajax({
            url: '/api/board/' + self.boardId(),
            type: 'changevisibility',
            data: { BoardId: self.boardId(), IsPublic: self.isPublic() }
        });
    }

}