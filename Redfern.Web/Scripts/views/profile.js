app.modules.add('profile', function () {

    // register route
    app.router.registerRoute('#/profile', function (context) {
        context.loadLocation('/profile', initialize);
    });

    var self = this;
    self.userName = ko.observable();
    self.fullName = ko.observable();
    self.email = ko.observable();

    
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
        repository.update();
    }
    
    self.uploadPhoto = function () {
        var repository = new UserProfileRepository();
        repository.userName(self.userName());
        //repository.fileContents(self.fileContents());
        //repository.fileName(self.fileName());
        //repository.fileContentType(self.fileContentType());
        repository.file(self.file());
        repository.uploadPhoto();
    }

    var initialize = function () {

        //$('.input-control', 'form#profile').inputControl();
        $.Metro.initInputs('form#avatar');

        self.userName(model.UserName);
        self.fullName(model.FullName);
        self.email(model.Email);


        var ui = app.ui.extend();
        ui.setWindowTitle('Profile');
        ui.addPart('form', self).bindTo('#profileForm');
        


    }

}())