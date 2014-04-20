function ErrorDialog (error){

    var error = error;

    return {
        open: function () {
            
            $.Dialog({
                overlay: false,
                shadow: true,
                flat: true,
                icon: false,
                title: '<strong>'+error.status+' - '+error.statusText+'</strong>',
                content: '<div class="padding20" style="overflow-y:scroll">'+ error.responseText+'</div>',
                width: '60%',
                height: '90%',
             
            });
        }
    }

}