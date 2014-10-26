function UserRepository() {
    var self = this;

    self.id = ko.observable();
    self.userName = ko.observable();
    self.fullName = ko.observable();
    self.email = ko.observable();

    self.addToRole = function (role) {
        return $.ajax({
            url: '/api/users/' + self.id() + '/add/' + role,
            type: 'post'
        });
    }

    self.removeFromRole = function (role) {
        return $.ajax({
            url: '/api/users/' + self.id() + '/remove/' + role,
            type: 'post'
        });
    }
    
    self.sendPasswordReset = function () {
        return $.ajax({
            url: '/api/users/' + self.id() + '/sendpasswordreset',
            type: 'post'
        })
    }

    self.unlock = function () {
        return $.ajax({
            url: '/api/users/' + self.id() + '/unlock',
            type: 'post'
        })
    }

    self.disable = function () {
        return $.ajax({
            url: '/api/users/' + self.id() + '/disable',
            type: 'post'
        })
    }

    self.enable = function () {
        return $.ajax({
            url: '/api/users/' + self.id() + '/enable',
            type: 'post'
        })
    }

    
    self.remove = function () {
        return $.ajax({
            url: '/api/user/'+self.id(),
            type: 'delete'
        });
    }



   

}