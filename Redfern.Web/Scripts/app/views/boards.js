app.modules.add('boards', function () {
    var dialog;

    // register routes
    app.router.registerRoute('#/boards', function (context) {
        context.loadLocation('/boards', initialize);
    });

    var initialize = function () {

        dialog = $.Dialog({
            overlay: false,
            shadow: true,
            flat: true,
            icon: false,
            title: '<strong>Participant</strong>',
            element: $('#NewBoardDialog'),
            width: '80%',
            height: '80%'
        });

        //$.Metro.initDragTiles();

        $('.tile-group').sortable({
            connectWith:'.tile-group'
        });
        

    }

    return {

    }


}());