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


function BoardProperties() {

}

function Sidebar(boardModel, columnsArray) {
    
    var columns = columnsArray,
        self = this;

    function loadTags() {
        var repository = new TagRepository();
        repository.getTags().done(function (tags) {
            $.each(tags, function (index, value) {
                self.tags.push({ tagId: index, tagName: value });
            })
        })
    }

    self.activeOption = ko.observable('main');
    self.boardId = ko.observable(boardModel.BoardId);
    self.boardName = ko.observable(boardModel.Name);
    self.tags = ko.observableArray();
    self.changeBoardName = function () {
        var repository = new BoardRepository();
        repository.boardId(self.boardId());
        repository.name(self.boardName());
        repository.update();
    }

    self.tags.subscribe(function (changes) {
        if (self.tags().length == 0){
            ko.utils.arrayForEach(columns(), function (column) {
                column.sortable(true);
                ko.utils.arrayForEach(column.cards(), function (card) {
                    card.show(true);
                })
            });
        } else {
            ko.utils.arrayForEach(columns(), function (column) {
                column.sortable(false);
                ko.utils.arrayForEach(column.cards(), function (card) {
                    card.show(false);
                    
                    ko.utils.arrayForEach(self.tags(), function (tag) {
                        if ($.inArray(tag, card.tags()) > -1) {
                            card.show(true);
                        }
                    })
                
                })
            });
        }

    }, null, "arrayChange")

    self.applyFilter = function () {
        
        ko.utils.arrayForEach(columns(), function (column) {
            ko.utils.arrayForEach(column.cards(), function (card) {
                card.show(false);
                ko.utils.arrayForEach(self.tags(), function (tag) {
                    
                    if ($.inArray(tag, card.tags()) > -1) {
                        card.show(true);
                    }
                })
                
            })
        });
    }

    $('#tags-container-filter').tagit({
        allowNewTags: false,
        triggerKeys: ['enter', 'tab'],
        tagSource: function (request, response) {
            $.ajax({
                url: '/api/tag/',
                type: 'GET',
                dataType: 'json',
                data: { name: request.term },
                success: function (data) {
                    response($.map(data, function (name, val) {
                        return { label: name, value: name, id: val }
                    }))
                }
            })
        },
        tagsChanged: function (tagValue, action, element) {
            if (action == 'added') {
                self.tags.push(tagValue);
            } else if (action == 'popped') {
                self.tags.remove(tagValue);
            }
        }
    })

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

function Card(cardModel, column) {
    var column = column,
        self = this;

    self.cardId = ko.observable(cardModel.CardId);
    self.title = ko.observable(cardModel.Title);
    self.description = ko.observable();
    self.assignedToUser = ko.observable();
    self.dueDate = ko.observable();
    self.boardId = ko.observable(cardModel.BoardId);
    self.columnId = ko.observable(cardModel.ColumnId);
    self.sequence = ko.observable(cardModel.Sequence);
    self.tags = ko.observableArray(cardModel.Tags)
    self.commentCount = ko.observable(cardModel.CommentCount);
    self.show = ko.observable(true);

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
    self.sortable = ko.observable(true);
    self.cards = ko.observableArray();
    $.each(column.Cards, function (index, value) {
        self.cards.push(new Card(value, self));
    });
    self.cardCount = ko.computed(function () {
        return self.cards().count;
    })

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

function BoardUI(boardModel) {
    var board = $('#Board'),
        boardWidth = '1000px',
        columnWidth = 325,
        self = this;

    self.boardId = ko.observable(boardModel.BoardId);
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
        boardWidth = (self.columns().length * columnWidth)+410;
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