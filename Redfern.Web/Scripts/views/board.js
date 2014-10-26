app.views.add('board', function () {
    var self = this;

    var cardId;

    // register routes
    app.router.registerRoute('#/board/:id/card/:cardid', function (context) {
        var id = this.params['id'];
        cardId = this.params['cardid'];

        if (($.boardcontext.current != null) && ($.boardcontext.current.boardId() == id)) {
            $.boardcontext.current.openCardById(cardId);
            cardId = null;
            return;
        } else {
            //else 
            context.loadLocation('/board/' + this.params['id'], initialize);

        }
        
    });

    app.router.registerRoute('#/board/:id', function (context) {
        var id = this.params['id'];
        if ($.boardcontext.current != null && $.boardcontext.current.boardId() == id) {
            // do nothing
            return;
        } 
        //else 
        context.loadLocation('/board/' + this.params['id'], initialize);
        
    });

    self.init = false;

    self.view = ko.observable('board');
    
    var initialize = function () {

        $.hubclientcontext.boardHub.unsubscribe();
        /*
        if ($.boardcontext.current != null) {
            $.boardcontext.current.stop() = null;
            $.boardcontext.current.hub = null;
            $.boardcontext.current = null;
        }
        */
        var boardUI = new BoardViewModel(model);
        var ui = app.ui.extend();
        ui.setWindowTitle(model.name);
        ui.appNavigationBar.selectedMenu(model.name);
        ui.addPart('boardUI', boardUI).bindTo('#Board');
        ui.addPart('sidebar', boardUI.sidebar).bindTo('#SidebarCharms')
        //ui.addPart('oversight', boardUI).bindTo('#Oversight');
        //ui.addPart('expandedColumn', boardUI).bindTo('#ExpandedColumn');
        
        $('.board-column-content').append('<div class="pinned" style="float:left;display:block; min-height:10px;height:10px;"/>');

        // get reference to the boardHub
        boardUI.hub = $.hubclientcontext.boardHub;

        // subscribe to changes to the board
        $.hubclientcontext.boardHub.subscribe(model.boardId);

        if (cardId != null) {
            $.boardcontext.current.openCardById(cardId);
            cardId = null;
        }

        ko.bindingHandlers.sortable.isEnabled = $.boardcontext.current.hasAccess('RearrangeCards');
    
    }

    

}());