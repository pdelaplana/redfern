function CardType(data) {
    var self = this;

    self.cardTypeId = ko.observable(data.cardTypeId);
    self.name = ko.observable(data.name);
    self.color = ko.observable(data.color);

    self.update = function () {
        var repository = new CardTypeRepository();
        repository.cardTypeId = self.cardTypeId();
        repository.name = self.name();
        repository.update().done(function (result) {
            // update all cards where name of cardtype may have changed
            $.boardcontext.utils.changeCardLabels(result.data.cardTypeId, result.data.name);
            // send notifications
            $.boardcontext.current.hub.notify.onColorLabelChanged($.boardcontext.current.boardId(), result.data, result.activityContext);
        });
    }
}
