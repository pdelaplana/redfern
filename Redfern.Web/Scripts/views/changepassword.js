app.modules.add('changepassword', function () {

    // register route
    app.router.registerRoute('#/profile/changepassword', function (context) {
        context.loadLocation('/profile/changepassword', initialize);
    });

    function ChangePasswordModel(data) {
        var self = this;
        self.userName = ko.observable(data.UserName);
        self.oldPassword = ko.observable(data.OldPassword);
        self.newPassword = ko.observable(data.NewPassword);
        self.confirmPassword = ko.observable(data.ConfirmPassword);

        self.passwordChanged = ko.observable(false);

        self.errors = ko.observableArray();

        self.cancel = function () {
            window.history.back();
        }

        self.changePassword = function () {
            if ($('#ChangePasswordForm').valid()) {

                $.ajax({
                    url: '/api/profile/' + self.userName(),
                    //type: 'post',
                    //contentType: 'application/x-form-urlencoded',
                    type: 'changepassword',
                    data: {
                        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                        OldPassword: self.oldPassword(),
                        NewPassword: self.newPassword(),
                        ConfirmPassword: self.confirmPassword(),
                    }
                }).done(function (result) {

                    if (result.Succeeded) {
                        self.passwordChanged(true);
                        //app.router.go('/#/profile');
                        
                    } else {
                        self.errors(result.Errors);
                    }

                });

            }
        }
    }

    
   
        
    var initialize = function () {

        var changePasswordModel = new ChangePasswordModel(model);

        var ui = app.ui.extend();

        ui.addPart('content', changePasswordModel).bindTo('#ChangePassword');
        
        ui.appNavigationBar.selectedMenu('All Boards');
        //ui.setWindowTitle(model.FullName + ' - Profile');
        ui.setWindowTitle('Change Password');

        $.validator.unobtrusive.parse('#ChangePasswordForm');
    }

}())