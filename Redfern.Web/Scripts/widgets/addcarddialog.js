function AddCardDialog (elementId){

    var elementId = elementId,
        self = this;

    self.name = ko.observable('');
    self.create = function () {
        
        var boardVM = new BoardViewModel();
        boardVM.name(self.name());
        boardVM.create().done(function (result) {
            $.Dialog.close();
            app.router.go('/#/board/'+result.BoardId);
        });
    }


    return {
        open: function () {
            $.Dialog({
                overlay: false,
                shadow: true,
                flat: true,
                icon: false,
                title: '<strong>Add a Card</strong>',
                content: $(elementId).html(),
                width: '80%',
                height: '90%',
                //position: { top: 50, left: 10 },
                onShow: function (dialog) {
                    //ko.applyBindings(self, $(dialog).get(0));
                }
            });
        }
    }

    





}