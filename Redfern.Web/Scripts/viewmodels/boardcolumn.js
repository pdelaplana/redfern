function BoardColumn() {
    var self = this;

    self.name = ko.observable();
    self.sequence = ko.observable();
    self.hidden = ko.observable();

    self.hide = function () { }

    self.show = function () { }

    self.move = function () { }
}