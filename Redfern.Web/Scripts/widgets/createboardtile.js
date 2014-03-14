function CreateBoardTile() {

    var self = this;
    
    self.name = ko.observable();

    self.create = function () {
        var boardVM = new BoardViewModel();
        boardVM.name(self.name());
        boardVM.create().done(function () {


        });
    }
}