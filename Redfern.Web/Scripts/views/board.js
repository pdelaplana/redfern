app.modules.add('board', function () {
    var dialog,
        self = this;

    // register routes
    app.router.registerRoute('#/board/:id', function (context) {
        context.loadLocation('/board/'+this.params['id'], initialize);
    });

    self.view = ko.observable('board');
    

    var initialize = function () {

        var ui = app.ui.extend();
        ui.setWindowTitle(model.Name);
        ui.appNavigationBar.selectedMenu(model.Name);
        ui.addPart('boardUI', new BoardUI(model)).bindTo('#Board');

        ui.addPart('sidebar', new Sidebar(model, ui.boardUI.columns)).bindTo('#SidebarCharms')
        ui.boardUI.adjustBoardWidth();

        ko.applyBindings(ui.boardUI, $('#Oversight').get(0));
                    
        $('.board-column').resizable({
            handles:'e'
        });
        $('[data-role=tab-control]', $('#OpenCardDialog')).tabcontrol();
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
       
        $('.slide-out-div').tabSlideOut({
            tabHandle: '.handle',                     //class of the element that will become your tab
            //pathToTabImage: '/content/images/contact_tab.gif', //path to the image for the tab //Optionally can be set using css
            imageHeight: '122px',                     //height of tab image           //Optionally can be set using css
            imageWidth: '50px',                       //width of tab image            //Optionally can be set using css
            tabLocation: 'right',                      //side of screen where tab lives, top, right, bottom, or left
            speed: 300,                               //speed of animation
            action: 'click',                          //options: 'click' or 'hover', action to trigger animation
            topPos: '46px',                          //position from the top/ use if tabLocation is left or right
            leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
            fixedPosition: true                      //options: true makes it stick(fixed position) on scroll
        });
       
        
        
    }

    return {

    }


}());