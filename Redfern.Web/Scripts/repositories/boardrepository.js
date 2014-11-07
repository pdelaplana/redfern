function BoardRepository() {
    var self = this;

    self.boardId = null;
    self.name = null;
    self.isPublic = null;

    self.getBoardsOfUser = function (userName) {
        return $.ajax({
            url: '/api/boards/list/'+userName,
            type: 'get'
        });
    }

    self.create = function () {
        return $.ajax({
            url: '/api/boards',
            type: 'post',
            data: { Name: self.name }
        });
    }

    self.update = function () {
        return $.ajax({
            url: '/api/boards/'+self.boardId,
            type: 'put',
            data: { BoardId : self.boardId, Name: self.name }
        });
    }
    
    self.remove = function () {
        return $.ajax({
            url: '/api/boards/' + self.boardId,
            type: 'delete'
        });
    }

    self.changeVisibility = function () {
        return $.ajax({
            url: '/api/boards/' + self.boardId+'/changevisibility',
            type: 'post',
            data: { BoardId: self.boardId, IsPublic: self.isPublic }
        });
    }

    self.archive= function () {
        return $.ajax({
            url: '/api/boards/' + self.boardId + '/archive',
            type: 'post',
            data: { BoardId: self.boardId }
        });
    }

    self.unarchive = function () {
        return $.ajax({
            url: '/api/boards/' + self.boardId + '/unarchive',
            type: 'post',
            data: { BoardId: self.boardId }
        });
    }
}