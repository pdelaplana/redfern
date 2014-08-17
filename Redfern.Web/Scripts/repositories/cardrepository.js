function CardRepository() {
    var self = this;

    self.cardId = null;
    self.title = null;
    self.description = null;
    self.boardId = null;
    self.columnId = null;
    self.sequence = null;
    self.color = null;
    self.cardTypeId = null;
    self.assignedToUser = null;
    self.dueDate = null;

    self.create = function () {
        return $.ajax({
            url: '/api/board/'+self.boardId+'/cards',
            type: 'post',
            data: {
                BoardId: self.boardId,
                ColumnId: self.columnId,
                Title: self.title,
                Sequence: self.sequence
            }
        });
    }

    self.update = function () {
        var postData = {};
        postData.CardId = self.cardId;
        if (self.title != null) postData.Title = self.title;
        if (self.description != null) postData.Description = self.description;
        if (self.cardTypeId != null) postData.CardTypeId = self.cardTypeId;
        if (self.assignedToUser != null) postData.AssignedToUser = self.assignedToUser;
        if (self.dueDate != null) postData.DueDate = self.dueDate;
        return $.ajax({
            url: '/api/board/' + self.boardId + '/cards/' + self.cardId,
            type: 'put',
            data: postData
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/board/'+self.boardId+'/cards/' + self.cardId,
            type: 'delete'
        });
    }

    self.archive = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'archive'
        });
    }

    self.unarchive = function () {
        return $.ajax({
            url: '/api/card/' + self.cardId(),
            type: 'unarchive'
        });
    }

    self.assign = function () {
        return $.ajax({
            url: '/api/board/{0}/cards/{1}/assign'.format(self.boardId, self.cardId),
            type: 'post',
            data: {
                CardId: self.cardId,
                AssignedToUser : self.assignedToUser
            }
        });
    }

    self.changeDueDate = function () {
        var postData = {};
        postData.CardId = self.cardId;
        postData.DueDate = self.dueDate;
        return $.ajax({
            url: '/api/board/' + self.boardId + '/cards/' + self.cardId+'/duedate',
            type: 'put',
            data: postData
        });
    }

    self.changeColor = function () {
        return $.ajax({
            url: '/api/board/{0}/cards/{1}/color'.format(self.boardId, self.cardId),
            type: 'post',
            data: {
                CardId: self.cardId,
                Color: self.color
            }
        });
    }

    self.resequence = function (ids) {
        return $.ajax({
            //url: '/api/board/'+self.boardId+'/cards/resequence',
            url: '/api/board/{0}/cards/resequence'.format(self.boardId),
            type: 'post',
            data: {
                CardId : self.cardId,
                TargetColumnId: self.columnId,
                CardIds: ids
            }
        })
    }


}