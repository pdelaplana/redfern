function BoardViewModel() {
    var self = this;

    self.boardId = ko.observable();
    self.name = ko.observable();

    this.create = function () {
        return $.ajax({
            url: '/api/board',
            type: 'post',
            data: { Name: self.name() }
        });
    }
    
}