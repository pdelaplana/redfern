//
// create application object
//
var app = new Application({
    appTitle: 'Redfern',
    appContainer: '#application-container'
});

$(function () {

    //
    // global ajax settings
    //
    $.ajaxSetup({
        // Disable caching of AJAX responses
        cache: false,
        error: function (err, type, httpStatus) {
            alert(err.status + " - " + err.responseText + " - " + httpStatus);
            //errorDialog.open(err.statusText, err.responseText);
            /*
            if (err.status == '403') {
                document.location = '/signIn';
            } else {
                document.open();
                document.write(err.responseText);
                document.close();
            }
            */
        }
    });

    app.ui.addPart('appNavigationBar', {
        selectedMenu: ko.observable('All Boards'),
        createBoard: function(){
            var dialog = new CreateBoardDialog('#CreateBoardDialog');
            dialog.open();
            
        }
        
    }).bindTo('#AppNavigationBar');


    app.ui.setWindowTitle('Home');
    app.start('app/#/boards');

})