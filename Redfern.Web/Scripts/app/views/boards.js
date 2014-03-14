app.modules.add('boards', function () {
    var dialog;

    // register routes
    app.router.registerRoute('#/boards', function (context) {
        context.loadLocation('/boards', initialize);
    });

    var initialize = function () {

        var ui = app.ui.extend();
        ui.addPart('createBoardTile', new CreateBoardTile()).bindTo('#CreateBoardTile');
    
        ui.setWindowTitle('Boards');

    }

    return {

    }


}());