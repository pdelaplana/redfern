app.modules.add('boards', function () {
    var self = this;
        
    // register routes
    app.router.registerRoute('#/boards', function (context) {
        context.loadLocation('/boards', initialize);
    });

    self.myBoards = ko.observableArray();
    self.sharedBoards = ko.observableArray();

    function BoardItem(boardModel) {
        var self = this;
        self.name = ko.observable(boardModel.Name)
        self.boardId = ko.observable(boardModel.BoardId);
        self.cardCount = ko.observable(boardModel.CardCount)
    }

    var initialize = function () {

        var ui = app.ui.extend();
        ui.appNavigationBar.selectedMenu('All Boards');
        ui.setWindowTitle('All Boards');

       
        var repository = new BoardRepository();
        repository.getBoardsOfUser(app.user.userName).done(function (result) {
            self.myBoards.removeAll();
            self.sharedBoards.removeAll();    
            $.each(result, function (index, value) {
                if (value.Owner == app.user.userName) {
                    self.myBoards.push(new BoardItem(value));
                } else {
                    self.sharedBoards.push(new BoardItem(value));
                }

            })
            ui.addPart('boards', self).bindTo('#Boards');
        });
       
    }

}());