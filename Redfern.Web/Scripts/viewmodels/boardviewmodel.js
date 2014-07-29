
function CardType(data) {
    var self = this;

    self.cardTypeId = ko.observable(data.CardTypeId);
    self.name = ko.observable(data.Name);
    self.color = ko.observable(data.Color);

    self.update = function () {
        var repository = new CardTypeRepository();
        repository.cardTypeId(self.cardTypeId());
        repository.name(self.name());
        repository.update();
    }
}


function BoardViewModel(data) {



    var self = this;

    // observables
    self.boardId = ko.observable(data.BoardId);
    self.name = ko.observable(data.Name);
    self.owner = ko.observable(data.Owner);
    self.ownerFullName = ko.observable(data.OwnerFullName);
    self.isPublic = ko.observable(data.IsPublic);
    self.viewOnly = ko.observable(data.ViewOnly);
    self.accessList = ko.observableArray(data.AccessList);
    self.columns = ko.observableArray();
    self.members = ko.observableArray();
    self.cardTypes = ko.observableArray();
    self.viewMode = ko.observable('board');
    self.height = ko.observable($(window).height());

    //
    // column extended functions
    //
    self.columns.visibleColumnCount = ko.computed(function () {
        return ko.utils.arrayFilter(self.columns(), function (column) {
            return column.show() == true;
        }).length;
    });

    // resequence all columns
    self.columns.resequenceAll = function () {
        var ids = new Array();
        $.each(self.columns(), function (index, value) {
            ids.push(value.columnId());
        })
        $.ajax({
            url: '/api/boardcolumn',
            type: 'resequence',
            data: {
                ColumnIds: ids
            }
        });
    }

    self.columns.add = {


    }


    // handler for new columns
    self.newColumn = {
        name: ko.observable(),
        save: function () {
            if (self.newColumn.name() == '') {
                return;
            }
            var repository = new BoardColumnRepository();
            repository.boardId(self.boardId());
            repository.name(self.newColumn.name());
            repository.create().done(function (result) {
                self.columns.splice(self.columns().length - 1, 0, new Column(result, self));
            });
        }
    }

    self.selectedColumn = ko.observable();
    self.expandColumn = function (item) {
        self.selectedColumn = item;
        self.viewMode('columnview');
    }

    
    self.getArchiveColumn = function () {
        return ko.utils.arrayFirst(self.columns(), function (column) {
            return column.name() == "Archived";
        })
    }

    self.getColumnById = function (columnId) {
        return ko.utils.arrayFirst(self.columns(), function (column) {
            return column.columnId() == columnId;
        })
    }


    self.hasAccess = function (accessType) {
        return ko.utils.arrayFirst(self.accessList(), function (item) {
            return item == accessType;
        }) != null;

    }


    // add sidebar UI
    self.sidebar = new BoardSidebar(self);


    // load members from viewmodel
    $.each(model.Members, function (index, value) {
        self.members.push(new BoardMember(value, self));
    });

    // load card types from viewmodel
    $.each(model.CardTypes, function (index, value) {
        self.cardTypes.push(new CardType(value, self));
    });

    // load columns from viewmodel
    $.each(model.Columns, function (index, value) {
        self.columns.push(new Column(value, self));
    });



}