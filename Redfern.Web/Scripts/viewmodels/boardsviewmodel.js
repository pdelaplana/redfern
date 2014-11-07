function BoardsViewModel() {
    var self = this;

    self.selectedView = ko.observable('myboards');

    self.unarchiveBoard = function (board) {

        var dialog = new UnarchiveBoardDialog('#UnarchiveBoardDialog', board.boardId(), board.name());
        dialog.open();

        

    }
   

    // 
    // do init stuff
    //
   
}

