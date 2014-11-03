function BoardFilters(columns) {
    var self = this,
        columns = columns;

    self.title = ko.observable();
    self.tags = ko.observableArray([]);
    self.cardTypes = ko.observableArray();
    self.assignees = ko.observableArray();
    self.periodDue = ko.observable();
    self.noSelection = function(){
        return (self.tags().length == 0) &&
                ((self.title() == null) || (self.title().length == 0)) &&
                ((self.periodDue() == null) || (self.periodDue().length == 0)) &&
                (self.cardTypes().length == 0) &&
                (self.assignees().length == 0);
    };
    self.isColorSelected = function(color){
        return (ko.utils.arrayFirst(self.cardTypes(), function (cardType) {
            return cardType.color() == color;
        }) != null);
    };
    self.isAssigneeSelected = function (userName) {
        return (ko.utils.arrayFirst(self.assignees(), function (assignee) {
            return assignee == userName;
        }) != null);
    };
    self.isPeriodDueSelected = function (periodDue) {
        return periodDue == self.periodDue();
    };
    self.setPeriodDue = function(periodDue){
        if (self.periodDue() == periodDue)
            self.periodDue('')
        else
            self.periodDue(periodDue)
    };
    self.addColorToFilter = function (cardType) {
        if (self.isColorSelected(cardType.color()))
            self.cardTypes.remove(cardType);
        else 
            self.cardTypes.push(cardType);
    };
    self.addAssigneeToFilter = function (assignee) {
        if (self.isAssigneeSelected(assignee))
            self.assignees.remove(assignee);
        else
            self.assignees.push(assignee);
    };
    self.addTag = function (tagName) {
        self.tags.push(tagName);
    };
    self.removeTag = function (tagName) {
        self.tags.remove(tagName);
    };
    self.applyFilter = function () {
        if (self.noSelection()) {
            ko.utils.arrayForEach(columns(), function (column) {
                $.boardcontext.current.enableSorting($.boardcontext.current.hasAccess('RearrangeCards'));
                ko.utils.arrayForEach(column.cards(), function (card) {
                    card.show(true);
                })
            });
        } else {
            ko.utils.arrayForEach(columns(), function (column) {
                $.boardcontext.current.enableSorting(false);
                ko.utils.arrayForEach(column.cards(), function (card) {
                    card.show(false);
                    if (self.title() != null && self.title().length > 0) {
                        if (card.title().toLowerCase().indexOf(self.title()) !== -1)
                            card.show(true);
                    }
                    if (self.periodDue() != null) {
                        var diffDays = moment(card.dueDate()).diff(moment(), 'days');
                        switch (self.periodDue()) {
                            case 'today':
                                if (diffDays == 0) card.show(true);
                                break;
                            case 'tomorrow':
                                if (diffDays == 1) card.show(true)
                                break;
                            case 'thisweek':
                                if ((diffDays < 8) && (diffDays > 0)) card.show(true)
                                break;
                            case 'nextweek':
                                if (diffDays > 7 && diffDays < 15) card.show(true)
                                break;
                            case 'pastdue':
                                if (diffDays < 0) card.show(true)
                                break;
                        }

                    }
                    if (self.tags().length > 0) {
                        ko.utils.arrayForEach(self.tags(), function (tag) {
                            if ($.inArray(tag, card.tags()) > -1) {
                                card.show(true);
                            }
                        })
                    }
                    if (self.cardTypes().length > 0) {
                        ko.utils.arrayForEach(self.cardTypes(), function (cardType) {
                            if (card.color() == cardType.color()) {
                                card.show(true);
                            }
                        })
                    }
                    if (self.assignees().length > 0) {
                        ko.utils.arrayForEach(self.assignees(), function (assignee) {
                            if (card.assignedToUser() == assignee) {
                                card.show(true);
                            }
                        })
                    }
                });
            });
        }

    };
    self.removeFilter= function () {
        self.tags.removeAll();
        self.cardTypes.removeAll();
        self.assignees.removeAll();
        self.title(null);
        self.periodDue(null);
        self.tags([]);
        //$('#tags-container-filter').tagit('reset');
    }

    self.title.subscribe(function (newValue) {
        self.applyFilter();
    })

    self.periodDue.subscribe(function (newValue) {
        self.applyFilter();
    })

    self.tags.subscribe(function (changes) {
        self.applyFilter();
    }, null, "arrayChange")

    self.cardTypes.subscribe(function (changes) {
        self.applyFilter();
    }, null, "arrayChange");

    self.assignees.subscribe(function (changes) {
        self.applyFilter();
    }, null, "arrayChange")

}