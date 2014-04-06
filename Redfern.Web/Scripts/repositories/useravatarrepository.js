function UserAvatarRepository() {
    var self = this;

    self.userName = ko.observable();

  
    self.file = ko.observable();
    self.fileName = ko.observable();
    self.fileContentType = ko.observable();
    self.fileUrl = ko.observable();
    self.fileContents = ko.observable();

    
    self.upload = function () {
        var formData = new FormData();
        formData.append('Contents', self.file());
        return $.ajax({
            url: '/api/avatar/'+self.userName(),
            type: 'put',
            data: formData,
            contentType: false,
            cache: false,
            processData: false
        });
    }

}