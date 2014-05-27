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

function Card(data, column) {
    var column = column,
        self = this;

    self.parent = column;
    self.cardId = ko.observable(data.CardId);
    self.title = ko.observable(data.Title);
    self.description = ko.observable(data.Description);
    self.cardTypeId = ko.observable(data.CardTypeId);
    self.color = ko.observable(data.Color);
    self.assignedToUser = ko.observable(data.AssignedToUser);
    self.assignedToUserFullName = ko.observable(data.AssignedToUserFullName);
    self.dueDate = ko.observable();
    self.archivedDate = ko.observable(data.ArchivedDate);
    self.isArchived = ko.observable(data.IsArchived);
    self.boardId = ko.observable(data.BoardId);
    self.columnId = ko.observable(data.ColumnId);
    self.sequence = ko.observable(data.Sequence);
    self.tags = ko.observableArray(data.Tags)
    self.commentCount = ko.observable(data.CommentCount);
    self.attachmentCount = ko.observable(data.AttachmentCount);

    self.show = ko.observable(true);

    self.isArchived.subscribe(function (newValue) {
        self.show(!newValue);
    })
    
    self.open = function () {
        var dialog = new CardPropertiesDialog('#CardPropertiesDialog', self);
        dialog.open();
    }

    self.update = function () {
        var repository = new CardRepository();
        repository.cardId(self.cardId());
        repository.title(self.title());
        repository.cardTypeId(self.cardTypeId())
        repository.assignedToUser(self.assignedToUser());
        repository.dueDate(self.dueDate());
        return repository.update();
    }

    self.remove = function () {
        if (confirm('You will not be able to undo this delete if you continue.')) {
            var repository = new CardRepository();
            repository.cardId(self.cardId());
            app.ui.block({ message: 'Please wait, deleting this card...' })
            return repository.remove().then(function () {
                self.parent.cards.remove(self);
                app.ui.unblock();
            });
        }

    }

    self.archive = function () {
        var repository = new CardRepository();
        repository.cardId(self.cardId());
        app.ui.block({ message: 'Please wait, archiving this card...' });
        return repository.archive().then(function () {
            self.isArchived(true);
            var archive = column.board.getArchiveColumn();
            var clonedCard = self.parent.cards.remove(self)[0];
            clonedCard.sequence(archive.cards().length);
            clonedCard.show(true);
            archive.cards.push(clonedCard);
            
            app.ui.unblock();
        });
    }

    self.move = function (fromColumn,toColumn) {
        
        $

    }

    self.assign = function () {
        var repository = new CardRepository();
        repository.cardId(self.cardId());
        repository.assignedToUser(self.assignedToUser());
        return repository.assign().then(function () {
           
        });
    }

}

function Column(data, board) {
    var properties,
        board = board,
        self = this;

    //
    self.board = board;

    // observables
    self.columnId = ko.observable(data.ColumnId);
    self.name = ko.observable(data.Name);
    self.boardId = ko.observable(data.BoardId);
    self.expanded = ko.observable(data.Expanded);
    self.show = ko.observable(!data.Hidden);
    self.mazimized = ko.observable(false);
    self.sortable = ko.observable(true);
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
        var repository = new BoardColumnRepository();
        repository.columnId(self.columnId());
        repository.hidden(!newValue);
        repository.update().done(function () {
        });
    })

    // operations
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
            card.title(self.newCard.title());
            card.boardId(self.boardId());
            card.columnId(self.columnId());
            card.sequence(self.cards().length);
            return card.create().done(function (item) {
                self.cards.push(new Card(item, self));
                var height = node[0].scrollHeight;
                node.scrollTop(height);
            })
        }
    }
    
    // column properties    
    self.openColumnProperties = function(data, event){
        properties = new ColumnProperties(event.target, data);
        properties.open();
    }
    
    // populate cards array from model
    $.each(data.Cards, function (index, value) {
        self.cards.push(new Card(value, self));
    });


}

function BoardMember(memberModel, boardUI) {
    var boardUI = boardUI,
        self = this;
    self.boardMemberId = ko.observable(memberModel.BoardMemberId);
    self.userName = ko.observable(memberModel.UserName);
    self.fullName = ko.observable(memberModel.FullName);
    self.selected = ko.observable(false);
    
    self.remove = function () {
        var repository = new BoardMemberRepository();
        repository.boardMemberId(self.boardMemberId());
        return repository.remove();
    }
}

function CardType(data, board) {
    var board = board,
        self = this;

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


function BoardUI(data) {
    var board = $('#Board'),
        boardWidth = '1000px',
        columnWidth = 325,
        self = this;

    self.boardWidth = ko.observable('1000px');
    self.columnWidth = ko.observable(325);

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
    

    // computed observables
    self.visibleColumnCount = ko.computed(function () {
        return ko.utils.arrayFilter(self.columns(), function (column) {
            return column.show() == true;
        }).length;
    });

 
    
    // handler for new columns
    self.newColumn = {
        name: ko.observable(),
        save: function () {
            if (self.newColumn.name() == '') {
                return;
            }
            var repo = new BoardColumnRepository();
            repo.boardId(self.boardId());
            repo.name(self.newColumn.name());
            repo.create().done(function (result) {
                self.columns.splice(self.columns().length - 1, 0, new Column(result, self));
            });
        }
    }

    self.selectedColumn = ko.observable();
    self.expandColumn = function (item) {
        self.selectedColumn=item;
        self.viewMode('columnview');
    }

    // resequence all columns
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

    self.getArchiveColumn = function () {
        return ko.utils.arrayFirst(self.columns(), function(column){
            return column.name() == "Archived";
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