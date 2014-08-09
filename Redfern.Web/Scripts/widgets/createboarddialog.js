function CreateBoardDialog(elementId){

    var elementId = elementId,
        self = this;

    self.name = ko.observable('');
    self.create = function () {
        if (self.name() != null && self.name() != '') {
            var repository = new BoardRepository();
            repository.name = self.name();
            repository.create().done(function (result) {
                $.Dialog.close();
                app.router.go('/#/board/' + result.boardId);
                app.ui.appNavigationBar.addBoardMenuItem(result);
            });
        }
    }


    return {
        open: function () {
            $.Dialog({
                overlay: false,
                shadow: true,
                flat: true,
                icon: false,
                title: '<strong>Create Board</strong>',
                content: $(elementId).html(),
                width: '25%',
                height: '50%',
                position: { top: 50, left: 10 },
                recenter: false,
                onShow: function (dialog) {
                    ko.applyBindings(self, $(dialog).get(0));
                }
            });
        }
    }

    





}