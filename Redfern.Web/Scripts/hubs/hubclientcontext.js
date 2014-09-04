$(function () {
    $.hubclientcontext = $.hubclientcontext || new HubClientContext();
})


function HubClientContext() {
    var self = this;

    self.connected = false;
    self.notificationsHub = new NotificationsHubClient();
    self.boardHub = new BoardHubClient();
    
    self.start = function (onStart) {
        
        // start signalr
        $.connection.hub.logging = true;

        $.connection.hub.start()
            .done(function () {
                self.connected = true;
                if (onStart != undefined && $.isFunction(onStart))
                    onStart();
            })
            .fail(function () {

            });

        $.connection.hub.connectionSlow(function () {
            $.Notify.show('Hub connection slow');
            console.log('Hub connection slow');
        });

        $.connection.hub.reconnecting(function () {
            $.Notify.show('Reconnecting to hub.');
            console.log('Reconnecting to hub.');
        });

        $.connection.hub.reconnected(function () {
            $.Notify.show('Reconnected to hub.');
            console.log('Reconnected to hub.');
        });

        $.connection.hub.disconnected(function () {
            $.Notify.show('Disconnected from hub.');
            console.log('Disconnected from hub.');
            self.connected = false;
            setTimeout(function () {
                $.connection.hub.start()
                    .done(function () {
                        self.connected = true;
                    })
                    .fail(function () {
                        console.log("Could not Connect!");
                    });
            }, 5000); // Restart connection after 5 seconds.

        });


    }

}