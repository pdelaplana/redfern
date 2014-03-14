app.modules.add('board', function () {
    var dialog;

    // register routes
    app.router.registerRoute('#/board/:id', function (context) {
        context.loadLocation('/board/'+this.params['id'], initialize);
    });

    var initialize = function () {

        //model = ko.mapping.fromJS(model);

        var ui = app.ui.extend();
        ui.setWindowTitle(model.Name);
        ui.appNavigationBar.selectedMenu(model.Name);
        ui.addPart('boardUI', new BoardUI(model)).bindTo('#Board');

        ui.boardUI.adjustBoardWidth();
        
        
        //$('.nano').nanoScroller();
        
        //$('.scrollbar1').tinyscrollbar({ thumbSize: 20 });
            
        $('.board-column').resizable({
            handles:'e'
        });

        /*
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

        */

        
        
    }

    return {

    }


}());