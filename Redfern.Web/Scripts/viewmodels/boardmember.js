function BoardMember(data) {
    var self = this;

    self.boardMemberId = ko.observable(data.boardMemberId);
    self.userName = ko.observable(data.userName);
    self.fullName = ko.observable(data.fullName);
    self.role = ko.observable(data.role);
    self.selected = ko.observable(false);

    self.remove = function () {
        var repository = new BoardMemberRepository();
        repository.boardId = BoardContext.current.boardId();
        repository.boardMemberId = self.boardMemberId();
        return repository.remove().then(function (result) {
            BoardContext.current.hub.notify.onCollaboratorRemoved(BoardContext.current.boardId(), self.userName(), result.activityContext);
            BoardContext.current.members.remove(self)
        });
    }
}
