function AppNavigationBar() {
    var self = this;
    self.selectedMenu = ko.observable('Show All');
    self.boardsList = ko.observableArray();
    self.createBoard = function () {
        var dialog = new CreateBoardDialog('#CreateBoardDialog');
        dialog.open();
    }
   
    
    var repository = new BoardRepository();
    repository.getBoardsOfUser(app.user.userName).done(function (result) {
        $.each(result, function (index, value) {
            self.boardsList.push({ boardId: value.BoardId, name: value.Name });
        })
    });
    
  
    
}