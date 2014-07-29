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
            if ((err.status == '403') || (err.status == '401') || (err.status == '0')) {
                window.location.reload();
            } else {
                var dialog = new ErrorDialog(err);
                dialog.open();
                console.log(err.status + " - " + err.responseText + " - " + httpStatus);
            }
        }
    });

    // 
    // block ui defaults
    // 
    $.blockUI.defaults.overlayCSS.opacity = .80;
    $.blockUI.defaults.overlayCSS.backgroundColor = '#eeeeee';

    
    // get authenticated user details from cookie
    var authenticatedUser = $.cookie("AuthenticatedUser");
    if (authenticatedUser != null)
        authenticatedUser = ko.utils.parseJson(authenticatedUser)
    app.user.userName = authenticatedUser.UserName;
    app.user.fullName = authenticatedUser.FullName;
    
    app.ui.addPart('appNavigationBar', new AppNavigationBar()).bindTo('#AppNavigationBar');
   
    // register routes 
    app.router.registerRoute('#/credits', function (context) {
        context.loadLocation('/credits', function () {
            app.ui.setWindowTitle('Credits');
            app.ui.appNavigationBar.selectedMenu('All Boards');
        });
    });


    app.ui.setWindowTitle('Home');
    app.start('app/#/boards');

    // keepalive
    KeepAlive();
})

function KeepAlive() {

    // send the hello message 
    var sentHello = $.cookie('hello') != null ? $.cookie('hello') : false;
    if (!sentHello) {
        $.ajax({
            url: '/session/keepalive',
            success: function () {
                $.cookie('hello', true);
            }
        })
    }

    setInterval(function () {
        $.get('/session/keepalive');
    }, 840000); // 14 mins * 60 * 1000
}


