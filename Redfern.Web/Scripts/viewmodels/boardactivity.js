function BoardActivity(data) {
    var self = this;

    self.activityId = ko.observable(data.activityId);
    self.actorId = ko.observable(data.actorId);
    self.description = ko.observable(data.description.replace(/(<([^>]+)>)/ig, ""));
    self.activityDate = ko.observable(data.activityDate);

    self.actorDisplayName = ko.observable(data.actorDisplayName);
    self.activityDate = ko.observable(data.activityDate);
    self.verb = ko.observable(data.verb);
    self.attribute = ko.observable(data.attribute);
    self.objectId = ko.observable(data.objectId);
    self.objectType = ko.observable(data.objectType);
    self.objectDisplayName = ko.observable(data.objectDisplayName);
    self.sourceId = ko.observable(data.sourceId);
    self.sourceType = ko.observable(data.sourceType);
    self.sourceDisplayName = ko.observable(data.sourceDisplayName);
    self.targetId = ko.observable(data.targetId);
    self.targetType = ko.observable(data.targetType);
    self.targetDisplayName = ko.observable(data.targetDisplayName);
    self.additionalData = ko.observable(data.additionalData);

    self.text = ko.computed(function () {
        if (self.objectType() == 'comment' && self.verb() == 'added') {
            return '<b>{0}</b> {1} {2} to {3} <b>{4}</b>'
                    .format(self.actorDisplayName(), self.verb(), self.objectType(), self.targetType(), self.targetDisplayName());
        } else if (self.targetDisplayName() != null && self.sourceDisplayName() != null) {
            return '<b>{0}</b> {1} {2} "<b>{3}</b>" from <b>{4}</b> to <b>{5}</b>.'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName(), self.sourceDisplayName(), self.targetDisplayName());
        } else if (self.targetDisplayName() != null) {
            return '<b>{0}</b> {1} {2} "<b>{3}</b>" to <b>{4}</b>.'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName(), self.targetDisplayName());
        } else if (self.sourceDisplayName() != null) {
            return '<b>{0}</b> {1} {2} "<b>{3}</b>" in <b>{4}</b>.'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName(), self.sourceDisplayName());
        } else if (self.attribute() != null) {
            return '<b>{0}</b> {1} {2} of {3} "<b>{4}</b>".'.format(self.actorDisplayName(), self.verb(), self.attribute(), self.objectType(), self.objectDisplayName());
        } else {
            return '<b>{0}</b> {1} {2} "<b>{3}</b>".'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName());
        }
    })

    self.additionalText = ko.computed(function () {
        if (self.additionalData() !=null) 
            return '"' + self.additionalData().truncate() + '"';
    })

    self.activityDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.activityDate()).toDate()).format('llll');
    })

    self.openCard = function () {
        var cardId;
        if (self.objectType() == 'card')
            cardId = self.objectId();
        else if (self.sourceType() == 'card')
            cardId = self.sourceId();
        else if (self.targetType() == 'card')
            cardId = self.targetId();

        app.router.go('#/board/{0}/card/{1}'.format($.boardcontext.current.boardId(), cardId));
    }

}
