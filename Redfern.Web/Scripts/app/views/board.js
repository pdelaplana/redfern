app.modules.add('board', function () {
    var dialog;

    // register routes
    app.router.registerRoute('#/board/:id', function (context) {
        context.loadLocation('/board/'+this.params['id'], initialize);
    });

    var initialize = function () {

        /*
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
        */
        //$.Metro.initDragTiles();

        $('.board-column-content').sortable({
            //placeholder: '.ui-state-highlight',
            placeholder: {
                element: function(currentItem) {
                    return $('<div class="tile double bg-steel"></div>')[0];
                },
                update: function(container, p) {
                    return;
                }
            },
            connectWith: '.board-column-content'
        });
        
        $('.board').sortable({
            placeholder: {
                element: function (currentItem) {
                    return $('<div class="board-column bg-steel"></div>')[0];
                },
                update: function (container, p) {
                    return;
                }
            },
        });

        $('.board-column').resizable({
            handles:'e'
        });

        $('.board-column i.icon-spin').click(function () {
            var column = $(this).parents('.board-column')
            $(column).flip({
                direction: 'lr',
                content: $('.form', column).show()
            });
        });

        $('[data-role=column-name]').click(function () {
            $(this).siblings('[data-role=name-editor]').show();

            $(this).hide();
        })
        
        $.Metro.initAccordions('#application-container');
        $.Metro.initDropdowns('#application-container');
    }

    return {

    }


}());