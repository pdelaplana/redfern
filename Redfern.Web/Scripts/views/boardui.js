var BoardColumnPlaceHolder = {
    element: function (currentItem) {
        return $('<div class="board-column bg-steel"></div>')[0];
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

function ColumnProperties(element, data) {
    var data = data,
        element = element,
        column = $(element).parents('div.board-column'),
        form = $('#ColumnPropertiesForm'),
        cloned = $(form).clone();

    $(cloned).removeAttr('id').insertBefore($('.board-column-wrapper', column));

    $('.revert', cloned).click(function () {
        cloned.slideUp('slow', function () {
            cloned.remove();
            $('.board-column-wrapper', column).show();
        });
        $('.board-column-wrapper', column).show('slow', function () { });
    });

    return {
        open: function () {
            $('.board-column-wrapper', column).slideToggle();
            $(cloned).slideDown('slow', function () { 
                ko.applyBindings(data, $(cloned).get(0));
                $('input', cloned).focus();
            });
        },
        close: function ()
        {
            $('.revert', cloned).click();
        }
    }
}


function Card(card, column) {
    var column = column,
        self = this;

    self.cardId = ko.observable(card.CardId);
    self.title = ko.observable(card.Title);
    self.description = ko.observable();
    self.assignedToUser = ko.observable();
    self.dueDate = ko.observable();
    self.boardId = ko.observable(card.BoardId);
    self.columnId = ko.observable(card.ColumnId);
    self.sequence = ko.observable(card.Sequence);
    self.tags = ko.observableArray(card.Tags)
    self.commentCount = ko.observable(card.CommentCount);

    self.open = function () {
        var dialog = new OpenCardDialog('#OpenCardDialog', self);
        dialog.open();
    }

    self.update = function () {
        var repository = new CardRepository();
        repository.cardId(self.cardId());
        repository.title(self.title());
        repository.assignedToUser(self.assignedToUser());
        repository.dueDate(self.dueDate());
        repository.update();
    }

    self.remove = function () {
        var repository = new CardRepository();
        repository.cardId(self.cardId());
        repository.remove().done(function () {
            column.cards.remove(self);
            $.Dialog.close();
        });
    }

   

}

function Column(column, board) {
    var properties,
        board = board,
        self = this;

    // column properties
    self.columnId = ko.observable(column.ColumnId);
    self.name = ko.observable(column.Name);
    self.boardId = ko.observable(column.BoardId);
    self.cards = ko.observableArray();
    $.each(column.Cards, function (index, value) {
        self.cards.push(new Card(value, self));
    });

    self.update = function () {
        var repository = new BoardColumnRepository();
        repository.columnId(self.columnId());
        repository.name(self.name());
        repository.update().done(function () {
            if (properties != null)
                properties.close();
        });
    }

    self.remove = function () {
        if (self.cards().length == 0) {
            var repository = new BoardColumnRepository();
            repository.columnId(self.columnId());
            repository.delete().done(function () {
                board.columns.remove(self);
            });

        } else {
            alert(self.cards().length + ' cards attched to column.')
        }
    }

    
    self.newCardTitle = ko.observable();
    self.addCard = function (data, node) {
        var card = new CardRepository();
        card.title(self.newCardTitle());
        card.boardId(self.boardId());
        card.columnId(self.columnId());
        card.sequence(self.cards().length);
        card.create().done(function (item) {
            self.cards.push(new Card(item, self));
            var height = node[0].scrollHeight;
            node.scrollTop(height);
        })   
    }

    self.resequenceAllCards = function (arg, event, ui) {
        var columnContent = this;
        var card = ui.item;
        var ids = new Array();
        $.each(self.cards(), function (index, value) {
            ids.push(value.cardId());
        })
        $.ajax({
            url: '/api/card',
            type: 'resequence',
            data: {
                ColumnId: self.columnId(),
                CardIds: ids
            }
        }).done(function () {
            $(columnContent).scrollTop(
                ($(card).offset().top+100) - $(columnContent).offset().top + $(columnContent).scrollTop()
                );
            //var height = $(columnContent)[0].scrollHeight;
            //$(columnContent).scrollTop(height);
        });

    }

    self.openColumnProperties = function(data, event){
        properties = new ColumnProperties(event.target, data);
        properties.open();
    }

    
    
}

function BoardUI(model) {
    var board = $('#Board'),
        boardWidth = '1000px',
        columnWidth = 325,
        self = this;

    self.boardId = ko.observable(model.BoardId);
    self.columns = ko.observableArray();
    self.newColumn = ko.observable();

    $.each(model.Columns, function (index, value) {
        self.columns.push(new Column(value, self));
    });

    self.columns.subscribe(function (changes) {
        $.each(changes, function (index, value) {
            if (value.status=='deleted')
                $(board).width($(board).width() - columnWidth);
            else if (value.status == 'added')
                $(board).width($(board).width() + columnWidth);
        })
    }, null, "arrayChange")

    self.adjustBoardWidth = function () {
        boardWidth = (self.columns().length * columnWidth)+350;
        $(board).width(boardWidth);
    }

    self.addColumn = function () {
        var repo = new BoardColumnRepository();
        repo.boardId(self.boardId());
        repo.name(self.newColumn());
        repo.sequence(self.columns().length);
        repo.create().done(function (model) {
            self.columns.push(new Column(model, self));
        });
    }
    
    self.resequenceAllColumns = function (param) {
        var ids = new Array();
        $.each(self.columns(), function(index, value){
            ids.push(value.columnId());
        })
        $.ajax({
            url: '/api/boardcolumn',
            type: 'resequence',
            data: {
                ColumnIds : ids
            }
        });

    }

}