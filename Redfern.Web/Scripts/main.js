var app = new Application('#application-container');

$(function () {

    //
    // global ajax settings
    //
    $.ajaxSetup({
        // Disable caching of AJAX responses
        cache: false,
        error: function (err, type, httpStatus) {
            //alert(err.status + " - " + err.statusText + " - " + httpStatus);
            errorDialog.open(err.statusText, err.responseText);
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

    //app = new Application();

    app.start('app/#/boards');

})