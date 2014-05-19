function UserRepository() {
    var self = this;

    self.id = ko.observable();
    self.userName = ko.observable();
    self.fullName = ko.observable();
    self.email = ko.observable();

    function sendCommand(type, extraParams){
        return $.ajax({
            url: '/api/user/' + self.id() + (extraParams != null) ? '?'+extraParams : '',
            type: type
        });
    }

    self.addToRole = function (role) {
        return $.ajax({
            url: '/api/user/' + self.id() +'?role='+role,
            type: 'addtorole'
        });
    }

    self.removeFromRole = function (role) {
        return $.ajax({
            url: '/api/user/' + self.id() + '?role=' + role,
            type: 'removefromrole'
        });
    }
    
    self.sendPasswordReset = function () {
        return $.ajax({
            url: '/api/user/' + self.id(),
            type: 'sendpasswordreset'
        })
    }

    self.unlock = function () {
        return sendCommand('unlock')
    }

    self.disable = function () {
      return sendCommand('disable')
    }

    self.enable = function () {
        return sendCommand('enable')
    }

    
    self.remove = function () {
        return $.ajax({
            url: '/api/user/'+self.id(),
            type: 'delete'
        });
    }



   

}