app.views.add('profile', function () {

    // register route
    app.router.registerRoute('#/profile', function (context) {
        context.loadLocation('/profile', initialize);
    });

    var self = this;
    self.userName = ko.observable();
    self.fullName = ko.observable();
    self.email = ko.observable();
    self.emailConfirmed = ko.observable();
    self.timestamp = ko.observable((new Date()).getTime());
    self.photoSrc = ko.computed(function () {
        var d = new Date();
        return '/api/avatar/' + self.userName() + '?width=400&height=400&ts=' + self.timestamp();
    }).extend({ notify: 'always'});

    self.file = ko.observable();
    self.fileName = ko.observable();
    self.fileContentType = ko.observable();
    self.fileUrl = ko.observable();
    self.fileContents = ko.observable();

    self.update = function () {
        var repository = new UserProfileRepository();
        repository.userName(self.userName());
        repository.fullName(self.fullName());
        repository.email(self.email());
        repository.update().done(function (result) {
            if (result.Succeeded) {
                var not = $.Notify.show('Your profile has been updated.')
            } else {
                $.each(result.Errors, function (index, value) {
                    $.Notify.show(value);
                });
            
            }
        });
    }
    
    self.uploadPhoto = function () {
        var repository = new UserAvatarRepository();
        repository.userName(self.userName());
        repository.file(self.file());
        repository.upload().done(function () {
            self.timestamp((new Date()).getTime());
        });
    }

    self.confirmEmail = function () {
        $.ajax({
            url: '/profile/confirmemail',
            success: function (result) {
                if (result.Succeeded)
                    $.Notify.show('A confirmation email has been sent to ' + self.email() + '.')
                else
                    $.Notify.show('An error was encountered')
            }
        });

    }

    var initialize = function () {

        $.Metro.initInputs('form#avatar');

        self.userName(model.UserName);
        self.fullName(model.FullName);
        self.email(model.Email);
        self.emailConfirmed(model.EmailConfirmed)

        var ui = app.ui.extend();
        ui.setWindowTitle('Profile');
        ui.addPart('form', self).bindTo('#profileForm');
        
        ui.appNavigationBar.selectedMenu('All Boards');
        ui.setWindowTitle(model.FullName + ' - Profile');

        
    }

}())