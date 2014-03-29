function TagRepository() {
    var self = this;

    self.getTags = function () {
        return $.ajax({
            url: '/api/tag',
            type: 'get',
            data: {
                name: ''
            }
        });
    }

}