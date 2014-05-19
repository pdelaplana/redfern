function AppNavigationBar() {
    
    function BoardItemMenu(data) {
        var self = this;
        self.boardId = ko.observable(data.BoardId);
        self.name = ko.observable(data.Name);
    }


    var self = this;
    self.selectedMenu = ko.observable('Show All');
    self.boardsList = ko.observableArray();
    self.createBoard = function () {
        var dialog = new CreateBoardDialog('#CreateBoardDialog');
        dialog.open();
    }
    self.addBoardMenuItem = function (data) {
        self.boardsList.push(new BoardItemMenu(data));
    }
    self.removeBoardMenuItem = function (boardId) {
        var board = ko.utils.arrayFirst(self.boardsList(), function (board) {
            return board.boardId() == boardId;
        });
        self.boardsList.remove(board);
    }

    self.updateBoardName = function (boardId, boardName) {
        var board = ko.utils.arrayFirst(self.boardsList(), function (board) {
            return board.boardId() == boardId;
        });
        board.name(boardName);
    }
   
    var repository = new BoardRepository();
    repository.getBoardsOfUser(app.user.userName).done(function (result) {
        $.each(result, function (index, value) {
            self.addBoardMenuItem(value);
        })
    });
    
  
    
}