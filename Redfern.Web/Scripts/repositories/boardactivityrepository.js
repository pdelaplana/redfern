function BoardActivityRepository() {
    var self = this;

    self.boardId = null;

    self.get = function(){
        return $.ajax({
            url: '/api/board/' +self.boardId+'/activity',
            type: 'get'
        });
    }
}