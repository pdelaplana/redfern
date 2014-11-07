function AppNavigationBar() {
    
    function BoardItemMenu(data) {
        var self = this;
        self.boardId = ko.observable(data.boardId);
        self.name = ko.observable(data.name);
    }


    var self = this;
    self.selectedMenu = ko.observable('All Boards');
    self.menuItems = ko.computed(function () {
        return $.boards.myBoards().concat($.boards.sharedBoards(), $.boards.publicBoards());
    });
    self.createBoard = function () {
        var dialog = new CreateBoardDialog('#CreateBoardDialog');
        dialog.open();
    }


    self.updateBoardName = function (boardId, boardName) {
        var board = $.boards.all.findByProperty('boardId', boardId);
        board.name(boardName);
    }
   

  
    
}