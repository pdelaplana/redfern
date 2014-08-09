var $board = $board || { context: null, utils: null }

$.boardcontext = {
    current : null
}

var BoardContext = {
    current : null
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

function BoardActivity(data) {
    var self = this;

    self.actorId = ko.observable(data.actorId);
    self.description = ko.observable(data.description.replace(/(<([^>]+)>)/ig, ""));
    self.activityDate = ko.observable(data.activityDate);

    self.actorDisplayName = ko.observable(data.actorDisplayName);
    self.activityDate = ko.observable(data.activityDate);
    self.verb = ko.observable(data.verb);
    self.objectType = ko.observable(data.objectType);
    self.objectDisplayName = ko.observable(data.objectDisplayName);
    self.sourceDisplayName = ko.observable(data.sourceDisplayName);
    self.targetType = ko.observable(data.targetType);
    self.targetDisplayName = ko.observable(data.targetDisplayName);

    self.text = ko.computed(function () {
        if (self.targetDisplayName() != null && self.sourceDisplayName() != null) {
            return '<b>{0}</b> {1} {2} "<b>{3}</b>" from <b>{4}</b> to <b>{5}</b>.'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName(), self.sourceDisplayName(), self.targetDisplayName());
        } else if (self.targetDisplayName() != null){
            return '<b>{0}</b> {1} {2} "<b>{3}</b>" to <b>{4}</b>.'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName(), self.targetDisplayName());
        } else if (self.sourceDisplayName() != null){
            return '<b>{0}</b> {1} {2} "<b>{3}</b>" from <b>{4}</b>.'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName(), self.sourceDisplayName());
        } else {
            return '<b>{0}</b> {1} {2} "<b>{3}</b>".'.format(self.actorDisplayName(), self.verb(), self.objectType(), self.objectDisplayName());
        }
    })

    self.activityDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.activityDate()).toDate()).format('llll');
    })

}

function Card(data, column) {
    var column = column,
        self = this;

    self.parent = column;
    self.cardId = ko.observable(data.cardId);
    self.title = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.cardTypeId = ko.observable(data.cardTypeId);
    self.color = ko.observable(data.color);
    self.createdByUserFullName = ko.observable(data.createdByUserFullName);
    self.createdDate = ko.observable(data.createdDate);
    self.assignedToUser = ko.observable(data.assignedToUser);
    self.assignedToUserFullName = ko.observable(data.assignedToUserFullName);
    self.dueDate = ko.observable();
    self.archivedDate = ko.observable(data.archivedDate);
    self.isArchived = ko.observable(data.isArchived);
    self.boardId = ko.observable(data.boardId);
    self.columnId = ko.observable(data.columnId);
    self.columnName = column.name;
    self.sequence = ko.observable(data.sequence);
    self.tags = ko.observableArray(data.tags)
    self.commentCount = ko.observable(data.commentCount);
    self.attachmentCount = ko.observable(data.attachmentCount);
    self.show = ko.observable(true);

    self.createdDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.createdDate()).toDate()).format('llll');
    })
    self.isArchived.subscribe(function (newValue) {
        self.show(!newValue);
    })

    // event handlers, used by the hub
    self.onCommentAdded = function (cardComment) { };
    self.onCommentUpdated = function (cardComment) { };
    self.onCommentRemoved = function (cardCommentId) { };
    self.onAttachmentAdded = function (attachment) { };
    self.onAttachmentRemoved = function (attachmentId) { };
    self.onDeleted = function () { };
  
    self.open = function () {
        var dialog = new CardPropertiesDialog('#CardPropertiesDialog', self);
        // add event handler hooks to dialog
        self.onCommentAdded = function (cardComment) {
            dialog.commentThread.comments.insert(new CommentListItem(cardComment), 0);
        }
        self.onCommentRemoved = function (commentId) {
            dialog.commentThread.comments.remove(dialog.commentThread.comments.findByProperty('commentId', commentId));
        }
        self.onCommentUpdated = function (cardComment) {
            var comment = dialog.commentThread.comments.findByProperty('commentId', cardComment.commentId);
            comment.comment(cardComment.comment);
            comment.commentDate(cardComment.commentDate);
        }
        self.onAttachmentAdded = function (attachment) {
            dialog.attachmentsList.attachments.insert(new AttachmentListItem(attachment),0);
        }
        self.onAttachmentRemoved = function (attachmentId) {
            dialog.attachmentsList.attachments.remove(dialog.attachmentsList.attachments.findByProperty('cardAttachmentId', attachmentId));
        }
        self.onDeleted = function () {
            //just close the dialog if its open
            $.Dialog.close();
        }
        dialog.open();
    }

    self.update = function () {
        var repository = new CardRepository();
        repository.boardId = self.boardId();
        repository.cardId = self.cardId();
        repository.title = self.title();
        repository.cardTypeId = self.cardTypeId();
        repository.assignedToUser = self.assignedToUser();
        repository.dueDate = self.dueDate();
        return repository.update().done(function (result) {
            $.boardcontext.current.hub.notify.onCardUpdated(result.data, result.activityContext);
        });
    }

    self.remove = function () {
        if (confirm('You will not be able to undo this delete if you continue.')) {
            var repository = new CardRepository();
            repository.boardId = self.boardId();
            repository.cardId = self.cardId();
            app.ui.block({ message: 'Please wait, deleting this card...' })
            return repository.remove().done(function (result) {
                $.boardcontext.current.hub.notify.onCardDeleted(self.boardId(), self.columnId(), self.cardId(), result.activityContext);
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
            //var archive = column.board.getArchiveColumn();
            var archive = column.board.columns.findByProperty('name', 'Archived');
            var clonedCard = self.parent.cards.remove(self)[0];
            clonedCard.sequence(archive.cards().length);
            clonedCard.show(true);
            archive.cards.push(clonedCard);
            
            app.ui.unblock();
        });
    }

    self.move = function (fromColumn,toColumn) {
        

    }

    self.assign = function () {
        var repository = new CardRepository();
        repository.boardId= self.boardId();
        repository.cardId =self.cardId();
        repository.assignedToUser = self.assignedToUser();
        return repository.assign().done(function (result) {
            self.parent.board.hub.notify.onCardAssigned(result.data, result.activityContext);
        });
    }

}

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
       
    })

    // operations
    self.update = function () {
        var repository = new BoardColumnRepository();
        repository.boardId = self.boardId();
        repository.columnId = self.columnId();
        repository.name= self.name();
        repository.update().done(function (result) {
            self.board.hub.notify.onColumnNameChanged(result.data.boardId, result.data.columnId, result.data.name, result.activityContext);
        });
    }

    self.remove = function () {
        if (self.cards().length == 0) {
            var repository = new BoardColumnRepository();
            repository.boardId=self.boardId();
            repository.columnId=self.columnId();
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

function BoardMember(data) {
    var self = this;

    self.boardMemberId = ko.observable(data.boardMemberId);
    self.userName = ko.observable(data.userName);
    self.fullName = ko.observable(data.fullName);
    self.selected = ko.observable(false);
    
    self.remove = function () {
        var repository = new BoardMemberRepository();
        repository.boardId = BoardContext.current.boardId();
        repository.boardMemberId = self.boardMemberId();
        return repository.remove().then(function (result) {
            BoardContext.current.hub.notify.onCollaboratorRemoved(BoardContext.current.boardId(), self.userName(), result.activityContext);
            BoardContext.current.members.remove(self)
        });
    }
}

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
            BoardContext.current.hub.notify.onColorLabelChanged(BoardContext.current.boardId(), result.data, result.activityContext);
        });
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
    self.isPublic = ko.observable(data.isPublic);
    self.viewOnly = ko.observable(data.viewOnly);
    self.accessList = ko.observableArray(data.accessList);
    self.columns = ko.observableArray();
    self.members = ko.observableArray();
    self.cardTypes = ko.observableArray();
    self.activities = ko.observableArray();
    self.viewMode = ko.observable('board');
    self.height = ko.observable($(window).height());
    

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
            repository.boardId=self.boardId();
            repository.name=self.newColumn.name();
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

    
    self.hasAccess = function (accessType) {
        return ko.utils.arrayFirst(self.accessList(), function (item) {
            return item == accessType;
        }) != null;
    }

    self.options = {
        showCardAge : ko.observable(false)
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

        // load columns from viewmodel
        $.each(result, function (index, activity) {
            self.activities.push(new BoardActivity(activity));
        });

    })
    


}


