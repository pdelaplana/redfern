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
        form = $('#ColumnEditForm');

    return {
        open: function () {

            var cloned = $(form).clone(),
                save = $('[data-role=save-btn]', cloned),
                name = $('input', cloned);

            $(cloned).removeAttr('id').insertBefore($('.board-column-wrapper', column));

            $('.board-column-wrapper', column).slideToggle();
            $(cloned).slideDown('slow', function () {
                $('input', cloned).val(data.name()).focus();
            });

            $('.revert', cloned).click(function () {
                cloned.slideUp('slow', function () {
                    cloned.remove();
                    $('.board-column-wrapper', column).show();
                });

                $('.board-column-wrapper', column).show('slow', function () { });
            });

            $(save).click(function () {
                data.name(name.val());
                $('.revert', cloned).click();
            });
        }
    }
}


function Card(card) {
    var self = this;
    self.cardId = ko.observable(card.CardId);
    self.title = ko.observable(card.Title)
    self.boardId = ko.observable(card.BoardId);
    self.columnId = ko.observable(card.ColumnId);
    self.sequence = ko.observable(card.Sequence);
    
}

function Column(column) {
    var self = this;

    self.columnId = ko.observable(column.ColumnId);
    self.name = ko.observable(column.Name);
    self.boardId = ko.observable(column.BoardId);
    self.cards = ko.observableArray();
    $.each(column.Cards, function (index, value) {
        self.cards.push(new Card(value));
    });
    
    self.newCardTitle = ko.observable();
    self.addCard = function (viewmodel, node) {
        //var dialog = new AddCardDialog('#AddCardDialog');
        //dialog.open();
        var card = new CardRepository();
        card.title(self.newCardTitle());
        card.boardId(self.boardId());
        card.columnId(self.columnId());
        card.sequence(self.cards().length);
        card.create().done(function (item) {
            self.cards.push(new Card(item));
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
        var props = new ColumnProperties(event.target, data);
        props.open();

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
        self.columns.push(new Column(value));
    });

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
            $(board).width($(board).width() + columnWidth);
            self.columns.push(new Column(model));
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

    

    self.makeSortable = function () {

        $('.board').sortable({
            placeholder: {
                element: function (currentItem) {
                    return $('<div class="board-column bg-steel"></div>')[0];
                },
                update: function (container, p) {
                    return;
                }
            },
            update: function (event, ui) {

            }
        });

    }

}