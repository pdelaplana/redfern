function UserProfileRepository() {
    var self = this;

    self.userName = ko.observable();
    self.fullName = ko.observable();
    self.email = ko.observable();

    self.create = function () {
        return $.ajax({
            url: '/api/profile',
            type: 'post',
            data: {
                CardId: self.cardId(),
                TagName: self.tagName()
            }
        });
    }

    self.update = function () {
        return $.ajax({
            url: '/api/profile/'+self.userName(),
            type: 'put',
            data: {
                UserName: self.userName(),
                FullName: self.fullName(),
                Email: self.email()
            }
        });
    }

    self.remove = function () {
        return $.ajax({
            url: '/api/profile',
            type: 'delete',
            data: {
                CardId: self.cardId(),
                TagName: self.tagName()
            }
        });
    }

   

}