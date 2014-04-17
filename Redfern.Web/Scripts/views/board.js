app.modules.add('board', function () {
    var dialog,
        self = this;

    // register routes
    app.router.registerRoute('#/board/:id', function (context) {
        context.loadLocation('/board/'+this.params['id'], initialize);
    });

    self.view = ko.observable('board');
    
    var initialize = function () {

        var boardUI = new BoardUI(model);
        var ui = app.ui.extend();
        ui.setWindowTitle(model.Name);
        ui.appNavigationBar.selectedMenu(model.Name);
        ui.addPart('boardUI', boardUI).bindTo('#Board');
        ui.addPart('sidebar', boardUI.sidebar).bindTo('#SidebarCharms')
        ui.addPart('oversight', boardUI).bindTo('#Oversight');
        ui.addPart('expandedColumn', boardUI).bindTo('#ExpandedColumn');
        
        $('.board-column-content').append('<div class="pinned" style="float:left;display:block; min-height:10px;height:10px;"/>');

    }

    

}());