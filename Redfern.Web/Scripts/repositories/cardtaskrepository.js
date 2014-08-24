function CardTaskRepository() {
    var apiUrl = '/api/board/{0}/card/{1}/tasks'
    self = this;

    self.cardTaskId = null;
    self.boardId = null;
    self.cardId = null;
    self.description = null;
    self.assignedToUser = null;
    self.assignedDate = null;
    self.completedByUser = null;
    self.completedDate = null;
    self.taskNotes = null;

    self.getAllForCard = function (boardId, cardId) {
        return $.ajax({
            url: apiUrl.format(boardId, cardId),
            type: 'get'
        });
    }

    self.create = function () {
        return $.ajax({
            url: apiUrl.format(self.boardId, self.cardId),
            type: 'post',
            data: {
                CardId: self.cardId,
                Description: self.description,
                AssignedToUser: self.assignedToUser,
                AssignedDate: self.assignedDate,
                TaskNotes: self.taskNotes
            }
        })
    }

    self.update = function () {
        return $.ajax({
            url: apiUrl.format(self.boardId, self.cardId)+'/'+self.cardTaskId,
            type: 'put',
            data: {
                CardTaskId: self.cardTaskId,
                CardId: self.cardId,
                Description: self.description,
                AssignedToUser: self.assignedToUser,
                AssignedDate: self.assignedDate,
                TaskNotes: self.taskNotes
            }
        })
    }

    self.delete = function () {
        return $.ajax({
            url: apiUrl.format(self.boardId, self.cardId)+'/'+self.cardTaskId,
            type: 'delete',
            data: {
                CardTaskId: self.cardTaskId
            }
        })
    }

    self.complete = function () {
        return $.ajax({
            url: apiUrl.format(self.boardId, self.cardId) + '/' + self.cardTaskId+'/complete',
            type: 'put',
            data: {
                CardTaskId: self.cardTaskId,
                CompletedByUser: self.completedByUser,
                CompletedDate: self.completedDate
            }
        })
    }






}