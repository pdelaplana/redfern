function BoardMemberRepository() {
    var self = this;
    self.boardMemberId = null;
    self.boardId = null;
    self.userName = null;

    self.create = function () {

        return $.ajax({
            url: '/api/board/{0}/members'.format(self.boardId),
            type: 'post',
            data: {
                BoardId: self.boardId,
                UserName: self.userName
            }
        })
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/board/{0}/members/{1}'.format(self.boardId,self.boardMemberId),
            type: 'delete'
        })
    }
}