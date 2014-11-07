function BoardItem(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.owner = ko.observable(data.owner);
    self.ownerFullName = ko.observable(data.ownerFullName);
    self.boardId = ko.observable(data.boardId);
    self.cardCount = ko.observable(data.cardCount);
    self.archiveDate = ko.observable(data.archiveDate);
    self.isPublic = ko.observable(data.isPublic)
    self.collaborators = ko.observableArray(data.collaborators);
}


function BoardsList() {
    var self = this;

    self.all = ko.observableArray([]);

    self.myBoards = ko.computed(function () {
        return ko.utils.arrayFilter(self.all(), function (board) {
            return ((board.archiveDate() == null) && (board.owner() == app.user.userName));
        })
    });
    self.sharedBoards = ko.computed(function () {
        return ko.utils.arrayFilter(self.all(), function (board) {
            return ($.inArray(app.user.userName, board.collaborators()) > -1) && (board.owner() != app.user.userName);
        })
    });
    self.publicBoards = ko.computed(function () {
        return ko.utils.arrayFilter(self.all(), function (board) {
            return (board.isPublic() && board.owner() != app.user.userName);
        })
    });
    self.archivedBoards = ko.computed(function () {
        return ko.utils.arrayFilter(self.all(), function (board) {
            return board.archiveDate() != null && board.owner() == app.user.userName;
        })
    });

    self.add = function (board) {
        self.all.push(board);
    };

    self.remove = function (boardId) {
        var board = self.all.findByProperty('boardId', boardId);
        if (board != null)
            self.all.remove(board);
    };
   

    //
    // populate the list
    //
    var repository = new BoardRepository();
    repository.getBoardsOfUser(app.user.userName).done(function (result) {
        $.each(result, function (index, value) {
            self.all.push(new BoardItem(value));

        })
    });



}