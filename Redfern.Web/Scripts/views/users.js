﻿app.views.add('users', function () {

    // register route
    app.router.registerRoute('#/users', function (context) {
        context.loadLocation('/users', initialize);
    });


    function UserListItem(data) {
        var self = this;
        // observables
        self.id = ko.observable(data.id);
        self.userName = ko.observable(data.userName);
        self.fullName = ko.observable(data.fullName);
        self.email = ko.observable(data.email);
        self.emailConfirmed = ko.observable(data.emailConfirmed);
        self.roles = ko.observableArray(data.roles);
        self.isEnabled = ko.observable(data.isEnabled);
        self.isLockedOut = ko.observable(data.isLockedOut);
        self.signupDate = ko.observable(data.signupDate);
        self.numberOfBoardsOwned = ko.observable(data.numberOfBoardsOwned)
        self.lastSigninDate = ko.observable(data.lastSigninDate);

        // computed
        self.signupDateInLocalTimeZone = ko.computed(function () {
            if (self.signupDate() != null)
                return moment(moment.utc(self.signupDate()).toDate()).format('lll');
            else
                "No sign up date";
        })
        self.timeFromSignupDate = ko.computed(function () {
            if (self.signupDate() != null)
                return moment.utc(self.signupDate()).fromNow();
            else
                return "";
        })

        self.lastSigninDateInLocalTimeZone = ko.computed(function () {
            if (self.lastSigninDate() != null)
                return moment(moment.utc(self.lastSigninDate()).toDate()).format('lll');
            else
                "Never Signed In";
        });
        self.timeFromLastSigninDate = ko.computed(function () {
            if (self.lastSigninDate() != null)
                return moment.utc(self.lastSigninDate()).fromNow();
            else
                return "";
        })


        // operations
        self.hasRole = function(role){
            return ko.utils.arrayFirst(self.roles(), function (currentRole) {
                return currentRole == role;
            }) != null;
        }

    }

    var self = this;
    self.users = ko.observableArray();
    self.remove = function (user) {
        if (user.numberOfBoardsOwned() > 0) {
            $.Notify.show('You cannot delete a user with boards associated with them.');
            return;
        } 
        var repository = new UserRepository();
        repository.id(user.id());
        repository.remove().done(function () {
            self.users.remove(user);
        });
    }
    self.addOrRemoveFromRole = function (user, role) {
        if (user.hasRole(role))
            self.removeFromRole(user, role);
        else
            self.addToRole(user, role);
    }
    self.addToRole = function (user, role) {
        var repository = new UserRepository();
        repository.id(user.id());
        repository.addToRole(role).done(function () {
            user.roles.push(role);
        });
    }
    self.removeFromRole = function (user, role) {
        var repository = new UserRepository();
        repository.id(user.id());
        repository.removeFromRole(role).done(function () {
            user.roles.remove(role);
        });
    }
    self.sendPasswordReset = function (user) {
        var repository = new UserRepository();
        repository.id(user.id());
        repository.sendPasswordReset().done(function () {
            $.Notify.show('A password reset email has been sent.');
        });
    }
    self.unlockUser = function (user) {
        var user = user,
            repository = new UserRepository();
        repository.id(user.id());
        repository.unlock().done(function () {
            user.isLockedOut(false);
            $.Notify.show('The user has been unlocked.');
        });
    }
    self.enableUser = function (user) {
        var repository = new UserRepository();
        repository.id(user.id());
        repository.enable().done(function () {
            user.isEnabled(true);
            $.Notify.show('The user has been enabled.');
        });
    }
    self.disableUser = function (user) {
        var repository = new UserRepository();
        repository.id(user.id());
        repository.disable().done(function () {
            user.isEnabled(false);
            $.Notify.show('The user has been disabled.');
        });
    }


   
    
    var initialize = function (container) {

        var ui = app.ui.extend();
        ui.appNavigationBar.selectedMenu('All Boards');
        ui.setWindowTitle('Users');

        self.users.removeAll();
        $.each(model.users, function (index, value) {
            self.users.push(new UserListItem(value));
        })

        ui.addPart('usersList', self).bindTo('#UsersList');
        
        $.Metro.initDropdowns('#UsersList');

    }

}())