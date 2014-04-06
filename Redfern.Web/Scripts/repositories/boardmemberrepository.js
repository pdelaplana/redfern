function BoardMemberRepository() {
    var self = this;
    self.boardMemberId = ko.observable();
    self.boardId = ko.observable();
    self.userName = ko.observable();

    self.create = function () {

        return $.ajax({
            url: '/api/boardmember',
            type: 'post',
            data: {
                BoardId: self.boardId(),
                UserName: self.userName()
            }
        })
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/boardmember/'+self.boardMemberId(),
            type: 'delete'
        })
    }
}