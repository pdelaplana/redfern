app.modules.add('boards', function () {
    var self = this;
        
    // register routes
    app.router.registerRoute('#/boards', function (context) {
        context.loadLocation('/boards', initialize);
    });

    self.myBoards = ko.observableArray();
    self.sharedBoards = ko.observableArray();
    self.publicBoards = ko.observableArray();

    function BoardItem(data) {
        var self = this;
        self.name = ko.observable(data.Name)
        self.ownerFullName = ko.observable(data.OwnerFullName)
        self.boardId = ko.observable(data.BoardId);
        self.cardCount = ko.observable(data.CardCount)
    }

    var initialize = function () {

        var ui = app.ui.extend();
        ui.appNavigationBar.selectedMenu('All Boards');
        ui.setWindowTitle('All Boards');

       
        var repository = new BoardRepository();
        repository.getBoardsOfUser(app.user.userName).done(function (result) {
            self.myBoards.removeAll();
            self.sharedBoards.removeAll();
            self.publicBoards.removeAll();
            $.each(result, function (index, value) {
                if (value.Owner == app.user.userName) {
                    self.myBoards.push(new BoardItem(value));
                }
                else if ($.inArray(app.user.userName, value.Collaborators) > -1) {
                    self.sharedBoards.push(new BoardItem(value));
                }
                else if (value.IsPublic){
                    self.publicBoards.push(new BoardItem(value));
                } 
            })
            ui.addPart('boards', self).bindTo('#Boards');
        });
       
    }

}());