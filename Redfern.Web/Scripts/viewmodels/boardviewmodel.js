var $board = $board || { context: null, utils: null }


var BoardContext = {
    current: null
}


var BoardColumnPlaceHolder = {
    element: function (currentItem) {
        var viewportHeight = $(window).height();
        var div = $('<div class="board-column bg-steel" />').height(viewportHeight - 125);
        return div[0];
    },
    update: function (container, p) {
        return;
    }
}

var CardPlaceHolder = {
    element: function (currentItem) {
        return $('<div class="tile double bg-steel"></div>')[0];
    },
    update: function (container, p) {
        return;
    }
}


function BoardViewModel(data) {

    var board = $('#Board'),
        boardWidth = '1000px',
        columnWidth = 325,
        self = this;

    self.boardWidth = ko.observable('1000px');
    self.columnWidth = ko.observable(325);

    // observables
    self.boardId = ko.observable(data.boardId);
    self.name = ko.observable(data.name);
    self.owner = ko.observable(data.owner);
    self.ownerFullName = ko.observable(data.ownerFullName);
    self.archiveDate = ko.observable(data.archiveDate);
    self.isPublic = ko.observable(data.isPublic);
    self.viewOnly = ko.observable(data.viewOnly);
    self.accessList = ko.observableArray(data.accessList);
    self.lastAccessedDate = ko.observable(data.lastAccessedDate);


    self.cards = ko.observableArray();
    self.columns = ko.observableArray();
    self.members = ko.observableArray();
    self.cardTypes = ko.observableArray();
    self.activities = ko.observableArray();
    self.viewMode = ko.observable('board');
    self.height = ko.observable($(window).height());
    self.enableSorting = ko.observable(true);

    self.newActivitiesCounter = ko.observable(0);

    // get columns that are visible
    self.columns.filterByVisible = ko.computed(function () {
        return ko.utils.arrayFilter(self.columns(), function (column) {
            return column.show() == true;
        });
    });

    // resequence all columns
    self.columns.resequenceAll = function (param) {
        var repository = new BoardColumnRepository();
        repository.boardId = self.boardId();
        repository.columnId = param.item.columnId();
        repository.resequence(self.columns.getArrayOfProperty('columnId'))
            .done(function (result) {
                self.hub.notify.onColumnMoved(result.data, result.activityContext);
            });
    }

    // store selected column - used when expanding column 
    self.columns.selected = ko.observable();

    // handler for new columns
    self.newColumn = {
        name: ko.observable(),
        save: function () {
            if (self.newColumn.name() == '') {
                return;
            }
            var repository = new BoardColumnRepository();
            repository.boardId = self.boardId();
            repository.name = self.newColumn.name();
            repository.create().done(function (result) {
                self.columns.insert(new Column(result.data, self), self.columns().length - 1);
                self.hub.notify.onColumnAdded(result.data, result.activityContext);
            });
        }
    }

    self.findCardById = function (cardId) {
        var found;
        $.each(self.columns(), function (index, column) {
            $.each(column.cards(), function (index, card) {
                if (card.cardId() == cardId) {
                    found = card;
                    return false;
                }
            })
        })
        return found;
    }

    self.openCardById = function (cardId) {
        $.each(self.columns(), function (index, column) {
            $.each(column.cards(), function (index, card) {
                if (card.cardId() == cardId) {
                    card.open();
                    return false;
                }
            })
        })

    }


    self.hasAccess = function (accessType) {
        return ko.utils.arrayFirst(self.accessList(), function (item) {
            return item == accessType;
        }) != null;
    }

    self.options = {
        showCardAge: ko.observable(false)
    }


    //*** Do initialization stuff here ****

    // assign this to global BoardContext object
    BoardContext.current = self;
    $.boardcontext.current = self;

    // add sidebar UI
    self.sidebar = new BoardSidebar(self);


    // load members from viewmodel
    $.each(model.members, function (index, value) {
        self.members.push(new BoardMember(value));
    });

    // load card types from viewmodel
    $.each(model.cardTypes, function (index, value) {
        self.cardTypes.push(new CardType(value, self));
    });

    // load columns from viewmodel
    $.each(model.columns, function (index, value) {
        self.columns.push(new Column(value, self));
    });

    // load activities from database
    var repository = new BoardActivityRepository();
    repository.boardId = model.boardId;
    repository.get().then(function (result) {

        $.each(result, function (index, activity) {
            self.activities.push(new BoardActivity(activity));
        });

        var lastActivityId = $.boardcontext.utils.getLastActivityId();
        var newActivities = ko.utils.arrayFilter(self.activities(), function (activity) {
            //return (moment(activity.activityDate()).isAfter(moment(self.lastAccessedDate())));
            if (lastActivityId != null) {
                return activity.activityId() > lastActivityId;
            } else {
                return false;
            }

        });
        self.newActivitiesCounter(newActivities.length);

        if (newActivities.length > 0)
            $.boardcontext.utils.saveLastActivityId(newActivities[0].activityId());
        //$.cookie('LastActivityId', newActivities[0].activityId(), { expires: 10 });
    })



}


