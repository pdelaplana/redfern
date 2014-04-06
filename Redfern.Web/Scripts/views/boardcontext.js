
function ColumnContext(data) {
    var self = this;

}

function BoardContext(data) {
    var self = this;

    self.boardId = ko.observable();
    self.name = ko.observable();
    self.members = ko.observableArray();
    self.columns = ko.observableArray();



}