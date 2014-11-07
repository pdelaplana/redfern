function UnarchiveBoardDialog(elementId, boardId, name) {
    var self = this;

    self.boardId = boardId;
    self.name = name;
    self.elementId = elementId;
    self.unarchive = function () {
        var repository = new BoardRepository();
        repository.boardId = self.boardId;
        repository.unarchive().done(function (result) {
            $.Dialog.close();
            var board = $.boards.all.findByProperty('boardId', result.data.boardId);
            board.archiveDate(null);
        })

    }

    self.cancel = function () {
        $.Dialog.close();
    }

    return {
        open : function () {
            $.Dialog({
                overlay: false,
                shadow: true,
                flat: true,
                icon: false,
                title: '<strong>Unarchive Board</strong>',
                content: $(self.elementId).html(),
                width: '45%',
                //height: '30%',
                //position: { top: 50, left: 10 },
                recenter: false,
                onShow: function (dialog) {
                    ko.applyBindings(self, $(dialog).get(0));
                }

            });
        }
    }
    

}