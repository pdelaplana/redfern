﻿function NotificationsHubClient() {
    var self = this,
        hub = $.connection.notificationsHub;

    // define client functions that will be called by the signalr hub
    (function () {
        hub.client.notify = function (notificationItem) {
            self.notifications.push(new Notification(notificationItem));
        };

        

    })();

    self.server = hub.server;

    self.notifications = ko.observableArray();

    self.subscribe = function (userName) {
        hub.server.subscribe(userName);

        // load notifications from database
        var repository = new NotificationRepository();
        repository.get(userName).done(function (result) {
            $.each(result, function (index, notification) {
                self.notifications.push(new Notification(notification));
            });
        })
    }

    self.unsubscribe = function (userName) {
        hub.server.unsubscribe(userName);   
    }

    self.notifyNewAssignment = function (cardId, sender, recipient) {
        hub.server.notifyNewAssignment(cardId, sender, recipient);
    }

    self.notifyNewCommentPosted = function (cardId, sender) {
        hub.server.notifyNewCommentPosted(cardId, sender);
    }

    
}

function Notification(data) {
    var self = this;
    self.notificationId = ko.observable(data.notificationId);
    self.notificationDate = ko.observable(data.notificationDate);
    self.sender = ko.observable(data.senderUser);
    self.senderFullName = ko.observable(data.senderUserFullName);
    self.notificationType = ko.observable(data.notificationType);
    self.objectType = ko.observable(data.objectType);
    self.objectId = ko.observable(data.objectId);
    self.objectDescription = ko.observable(data.objectDescription);
    // for due and overdue crs
    self.dueDate = ko.observable(data.dueDate);
    self.message = ko.computed(function () {
        if (self.notificationType() == 'AssignCard') {
            return '{0} assigned a card to you.'.format(self.senderFullName());
        } 
        else if (self.notificationType() == 'NewCommentPosted') { 
            return '{0} posted a comment to your card.'.format(self.senderFullName());
        }
        else if (self.notificationType() == 'DueCard') {
            var dueDays = moment(self.dueDate()).diff(moment(), 'days'),
                dueDate = moment(self.dueDate()).format('ll');
            if (dueDays < 0) {
                return 'The card <b>"{0}"</b> is overdue by <b>{1}</b> days; was due on {2}.'.format(self.objectDescription(), Math.abs(dueDays), dueDate);
            } else if (dueDays == 0) {
                return 'The card <b>"{0}"</b> is due today.'.format(self.objectDescription(), dueDays, dueDate);

            } else {
                return 'The card <b>"{0}"</b> is due in <b>{1}</b> days on <b>{2}</b>.'.format(self.objectDescription(), dueDays, dueDate);
            }
        } else
            return 'You have been notified';
    })
    

    self.open = function () {
        if (self.objectType() == 'card') {
            var boardId = self.objectId().split(';')[0].split('=')[1],
                cardId = self.objectId().split(';')[1].split('=')[1];
            app.router.go('#/board/{0}/card/{1}'.format(boardId, cardId));

            // delete the notification
            if (self.notificationId() > 0) {
                var repository = new NotificationRepository();
                repository.notificationId = self.notificationId();
                repository.remove().done(function (result) {
                    $.hubclientcontext.notificationsHub.notifications.remove(self);
                })
            }
        } else {
            //do nothing
        }
    }
}