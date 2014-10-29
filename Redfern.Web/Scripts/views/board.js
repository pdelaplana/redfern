$.boardcontext = {
    current: null,
    utils: {
        changeCardLabels: function (cardTypeId, label) {
            // update all cards where name of cardtype may have changed
            ko.utils.arrayForEach($.boardcontext.current.columns(), function (column) {
                ko.utils.arrayForEach(column.cards(), function (card) {
                    if (card.cardTypeId() == cardTypeId)
                        card.cardLabel(label);
                })
            })
        },
        saveLastActivityId: function (activityId) {
            $.cookie($.boardcontext.current.boardId() + ';LastActivityId', activityId, { expires: 10 });
        },
        getLastActivityId: function () {
            return $.cookie($.boardcontext.current.boardId() + ';LastActivityId');
        }
    }
}


app.views.add('board', function () {
    var self = this,
        cardId = null;

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

        // check if a card needs to be opened
        if (cardId != null) {
            $.boardcontext.current.openCardById(cardId);
            cardId = null;
        }


        ko.bindingHandlers.sortable.isEnabled = $.boardcontext.current.hasAccess('RearrangeCards');
    
    }

    

}());