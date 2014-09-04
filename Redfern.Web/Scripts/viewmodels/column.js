function Column(data, board) {
    var self = this;
    //
    self.board = board;

    // observables
    self.columnId = ko.observable(data.columnId);
    self.name = ko.observable(data.name);
    self.boardId = ko.observable(data.boardId);
    self.expanded = ko.observable(data.expanded);
    self.show = ko.observable(!data.hidden);
    self.mazimized = ko.observable(false);
    self.cards = ko.observableArray();
    self.cardCount = ko.computed(function () {
        return self.cards().count;
    })
    self.visibleCardCount = ko.computed(function () {
        return ko.utils.arrayFilter(self.cards(), function (card) {
            return card.show();
        }).length;
    });
    self.isArchiveColumn = ko.computed(function () {
        return self.name() == "Archived";
    })

    // subscriptions
    self.show.subscribe(function (newValue) {

    })

    // operations
    self.update = function () {
        var repository = new BoardColumnRepository();
        repository.boardId = self.boardId();
        repository.columnId = self.columnId();
        repository.name = self.name();
        repository.update().done(function (result) {
            self.board.hub.notify.onColumnNameChanged(result.data.boardId, result.data.columnId, result.data.name, result.activityContext);
        });
    }

    self.remove = function () {
        if (self.cards().length == 0) {
            var repository = new BoardColumnRepository();
            repository.boardId = self.boardId();
            repository.columnId = self.columnId();
            repository.delete().done(function (result) {
                self.board.hub.notify.onColumnDeleted(self.boardId(), self.columnId(), result.activityContext);
                self.board.columns.remove(self);
            });
        } else {
            alert(self.cards().length + ' cards attached to column.')
        }
    }

    self.toggleVisibility = function () {
        if (self.hidden())
            self.hidden(false)
        else
            self.hidden(true);

    }

    self.toggleFocus = function () {
        self.mazimized(!self.mazimized());
    }

    self.resequenceAllCards = function (arg, event, ui) {
        var movedCard = arg.item;
        movedCard.parent = self;

        var columnContent = this;
        var card = ui.item;

        var repository = new CardRepository();
        repository.boardId = self.boardId();
        repository.cardId = movedCard.cardId();
        repository.columnId = self.columnId();
        repository.resequence(self.cards.getArrayOfProperty('cardId'))
            .done(function (result) {
                self.board.hub.notify.onCardMoved(result.data, result.activityContext);
                $(columnContent).scrollTop(
                    ($(card).offset().top + 100) - $(columnContent).offset().top + $(columnContent).scrollTop()
                );

                //var height = $(columnContent)[0].scrollHeight;
                //$(columnContent).scrollTop(height);
            });
    }


    // handle new cards
    self.newCard = {
        title: ko.observable(),
        save: function (data, node) {
            var card = new CardRepository();
            card.title = self.newCard.title();
            card.boardId = self.boardId();
            card.columnId = self.columnId();
            card.sequence = self.cards().length;
            return card.create().done(function (result) {
                self.board.hub.notify.onCardAdded(result.data, result.activityContext);
                self.cards.push(new Card(result.data, self));

                //var height = node[0].scrollHeight;
                //node.scrollTop(height);
            })
        }
    }


    self.expand = function (column) {
        self.board.columns.selected = column;
        self.board.viewMode('columnview');
    }

    // populate cards array from model
    $.each(data.cards, function (index, value) {
        self.cards.push(new Card(value, self));
    });


}
