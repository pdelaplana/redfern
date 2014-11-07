app.views.add('boards', function () {
    var self = this;
        
    // register routes
    app.router.registerRoute('#/boards', function (context) {
        context.loadLocation('/boards', initialize);
    });



    var initialize = function () {

        var ui = app.ui.extend();
        ui.appNavigationBar.selectedMenu('All Boards');
        ui.setWindowTitle('All Boards');
        ui.addPart('boards', new BoardsViewModel()).bindTo('#Boards');
       
        
    }

}());