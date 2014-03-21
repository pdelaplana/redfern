function UserProfileRepository() {
    var self = this;

    self.userName = ko.observable();
    self.fullName = ko.observable();
    self.email = ko.observable();

    self.file = ko.observable();
    self.fileName = ko.observable();
    self.fileContentType = ko.observable();
    self.fileUrl = ko.observable();
    self.fileContents = ko.observable();

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

    self.uploadPhoto = function () {
        var formData = new FormData();
        //formData.append('Title', self.fileName());
        //formData.append('FileName', self.fileName());
        //formData.append('ContentType', self.fileContentType());
        //formData.append('Contents', self.fileContents());
        formData.append('Contents', self.file());
        return $.ajax({
            url: '/api/profile/'+self.userName(),
            type: 'avatar',
            data: formData,
            contentType: false,
            cache: false,
            processData: false
        });
    }

}