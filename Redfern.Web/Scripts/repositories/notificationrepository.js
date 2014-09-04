function NotificationRepository() {
    var self = this;

    self.notificationId = null;

    self.get = function (user) {
        return $.ajax({
            url: '/api/notification/' + user,
            type: 'get'
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/notification/'+self.notificationId,
            type: 'delete'
        });
    }
}