function BoardColumnRepository() {
    var apiUrl = '/api/board/{boardid}/columns',
        self = this;

    self.boardId = null;
    self.columnId = null;
    self.name = null;
    self.sequence = null;
    self.hidden = null;
    self.expanded = null;

    self.hide = function () { }

    self.show = function () { }

    self.move = function () { }

    self.create = function () {
        return $.ajax({
            url: apiUrl.replace('{boardid}', self.boardId),
            type: 'post',
            data: {
                BoardId: self.boardId,
                Name: self.name,
                Sequence: self.sequence
            }
        });
    }

    self.update = function () {
        var postData = {
            ColumnId : self.columnId
        };
        if (self.name != null)
            postData.Name = self.name;
        if (self.hidden != null)
            postData.Hidden = self.hidden;
        return $.ajax({
            url: apiUrl.replace('{boardid}', self.boardId)+'/'+self.columnId,
            type: 'put',
            data: postData
        });
    }

    self.toggle = function () {
        return $.ajax({
            url: apiUrl.replace('{boardid}', self.boardId) + '/' + self.columnId +'/show',
            type: 'put',
            data: {
                ColumnId: self.columnId,
                Hidden: self.hidden
            }
        });
    }

    
    self.delete = function () {
        return $.ajax({
            url: apiUrl.replace('{boardid}', self.boardId) + '/' + self.columnId,
            type: 'delete'
        });
    }

    self.resequence = function (columnIds) {
        return $.ajax({
            url: apiUrl.replace('{boardid}', self.boardId)+'/resequence',
            type: 'post',
            data: {
                MovedColumnId: self.columnId,
                ColumnIds: columnIds
            }
        });
    }
}