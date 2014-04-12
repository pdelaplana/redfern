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
            if ((err.status == '403') || (err.status == '401')) {
                //document.location = '/account/signin';
                window.location.reload();
            } else {
                alert(err.status + " - " + err.responseText + " - " + httpStatus);
                console.log(err.status + " - " + err.responseText + " - " + httpStatus);
            }
            
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

    
    // get authenticated user details from cookie
    var authenticatedUser = $.cookie("AuthenticatedUser");
    if (authenticatedUser != null)
        authenticatedUser = ko.utils.parseJson(authenticatedUser)
    app.user.userName = authenticatedUser.UserName;
    app.user.fullName = authenticatedUser.FullName;
    
    app.ui.addPart('appNavigationBar', new AppNavigationBar()).bindTo('#AppNavigationBar');

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
