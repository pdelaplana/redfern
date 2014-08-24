app.views.add('board', function () {
    var self = this;
        
    var cardId;
    // register routes

    app.router.registerRoute('#/board/:id/card/:cardid', function (context) {
        var id = this.params['id'];
        cardId = this.params['cardid'];

        if (($.boardcontext.current != null) && ($.boardcontext.current.boardId() == id)) {
            $.boardcontext.current.openCardById(cardId);
            cardId = null;
            return;
        } else {
            //else 
            context.loadLocation('/board/' + this.params['id'], initialize);

        }
        
    });

    app.router.registerRoute('#/board/:id', function (context) {
        var id = this.params['id'];
        if ($.boardcontext.current != null && $.boardcontext.current.boardId() == id) {
            // do nothing
            return;
        } 
        //else 
        context.loadLocation('/board/' + this.params['id'], initialize);
        
    });

    self.init = false;

    self.view = ko.observable('board');
    
    var initialize = function () {

        var boardUI = new BoardViewModel(model);
        var ui = app.ui.extend();
        ui.setWindowTitle(model.name);
        ui.appNavigationBar.selectedMenu(model.name);
        ui.addPart('boardUI', boardUI).bindTo('#Board');
        ui.addPart('sidebar', boardUI.sidebar).bindTo('#SidebarCharms')
        ui.addPart('oversight', boardUI).bindTo('#Oversight');
        ui.addPart('expandedColumn', boardUI).bindTo('#ExpandedColumn');
        
        $('.board-column-content').append('<div class="pinned" style="float:left;display:block; min-height:10px;height:10px;"/>');

        // configure signalr hub and attach to boardviewmodel
        boardUI.hub = new BoardHubClient();

        // define event handlers for signalr hub
        boardUI.hub.addToActivityStream = function (activityListItem) {
            var activity = new BoardActivity(activityListItem);
            $.boardcontext.current.activities.insert(activity, 0);
        }

        boardUI.hub.onBoardNameChanged = function (name) {
            $.boardcontext.current.name(name);
            app.ui.appNavigationBar.updateBoardName($.boardcontext.current.boardId(), $.boardcontext.current.name());
            app.ui.appNavigationBar.selectedMenu($.boardcontext.current.name());
        }

        boardUI.hub.onBoardVisibilityChanged = function (isPublic) {
            $.boardcontext.current.isPublic(isPublic);
            app.ui.appNavigationBar.updateBoardName($.boardcontext.current.boardId(), $.boardcontext.current.name());
            app.ui.appNavigationBar.selectedMenu($.boardcontext.current.name());
        }

        boardUI.hub.onBoardArchived = function () {
            app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
            app.router.go('/#/boards');
        }

        boardUI.hub.onBoardDeleted = function () {
            app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
            app.router.go('/#/boards');
        }

        boardUI.hub.onCollaboratorAdded = function (boardMember) {
            $.boardcontext.current.members.push(new BoardMember(boardMember))
        }

        boardUI.hub.onCollaboratorRemoved = function (userName) {
            var member = $.boardcontext.current.members.findByProperty('userName', userName);
            $.boardcontext.current.members.remove(member);
            // current user has been remomved, so boot him out of the board
            if (app.user.userName == userName) {
                app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
                app.router.go('/#/boards');
            }
        }

        boardUI.hub.onColorLabelChanged = function (cardTypeData) {
            var cardType = $.boardcontext.current.cardTypes.findByProperty('cardTypeId', cardTypeData.cardTypeId);
            cardType.name(cardTypeData.name);
            // update all cards where name of cardtype may have changed
            $.boardcontext.utils.changeCardLabels(cardTypeData.cardTypeId, cardTypeData.name);

        }

        boardUI.hub.onCardAdded = function (card) {
            var column = ui.boardUI.columns.findByProperty('columnId', card.columnId);
            column.cards.push(new Card(card, column));
        }
        boardUI.hub.onCardUpdated = function (card) {
            var column = ui.boardUI.columns.findByProperty('columnId', card.columnId);
            if (column != null){
                var cardToUpdate = column.cards.findByProperty('cardId', card.cardId);
                if (cardToUpdate != null) {
                    cardToUpdate.title(card.title);
                    cardToUpdate.description(card.description);
                }
            }
        }
        boardUI.hub.onCardDeleted = function (columnId, cardId) {
            var column = ui.boardUI.columns.findByProperty('columnId', columnId);
            if (column != null) {
                var cardToDelete = column.cards.findByProperty('cardId', cardId);
                if (cardToDelete != null) {
                    // ensure that card does a clean up (i.e. if opened and viewed by another collaborator)
                    cardToDelete.onDeleted();
                    column.cards.remove(cardToDelete);
                }
            }
        }
        boardUI.hub.onCardMoved = function (card) {
            var cardToMove;
            $.each(ui.boardUI.columns(), function (index, column) {
                $.each(column.cards(), function (index, cardInColumn) {
                    if (cardInColumn.cardId() == card.cardId) {
                        column.cards.remove(cardInColumn);
                        return false;
                    }
                })
            })
            var targetColumn = ui.boardUI.columns.findByProperty('columnId', card.columnId);
            targetColumn.cards.insert(new Card(card, targetColumn), card.sequence);
        }
        boardUI.hub.onCardAssigned = function (card) {
            var cardFound = ui.boardUI.findCardById(card.cardId);
            cardFound.assignedToUser(card.assignedToUser);
            cardFound.assignedToUserFullName(card.assignedToUserFullName);
        }
        boardUI.hub.onCardCommentAdded= function (cardComment) {
            var card = ui.boardUI.findCardById(cardComment.cardId);
            card.onCommentAdded(cardComment);
            card.commentCount(card.commentCount() + 1);
        }
        boardUI.hub.onCardCommentRemoved = function (cardId, commentId) {
            var card = ui.boardUI.findCardById(cardId);
            card.onCommentRemoved(commentId);
            card.commentCount(card.commentCount() - 1);
        }
        boardUI.hub.onCardCommentUpdated = function (cardComment) {
            var card = ui.boardUI.findCardById(cardComment.cardId);
            card.onCommentUpdated(cardComment);
        }
        boardUI.hub.onCardAttachmentAdded = function (attachment) {
            var card = ui.boardUI.findCardById(attachment.cardId);
            card.onAttachmentAdded(attachment);
            card.attachmentCount(card.attachmentCount() + 1);
        }
        boardUI.hub.onCardAttachmentRemoved = function (cardId, attachmentId) {
            var card = ui.boardUI.findCardById(cardId);
            card.onAttachmentRemoved(attachmentId);
            card.attachmentCount(card.attachmentCount() - 1);
        }

        boardUI.hub.onCardColorChanged = function (cardId, cardTypeId, label, color) {
            var card = ui.boardUI.findCardById(cardId);
            card.cardTypeId(cardTypeId);
            card.cardLabel(label);
            card.color(color);
        }

        boardUI.hub.onCardDueDateChanged = function (cardId, dueDate) {
            var card = ui.boardUI.findCardById(cardId);
            card.dueDate(dueDate);
        }

        boardUI.hub.onCardTagAdded = function (cardId, tagName) {
            var card = ui.boardUI.findCardById(cardId);
            card.tags.disableUpdates = true;
            card.tags.push(tagName);
            card.tags.disableUpdates = false;
        }
        boardUI.hub.onCardTagRemoved = function (cardId, tagName) {
            var card = ui.boardUI.findCardById(cardId);
            card.tags.disableUpdates = true;
            card.tags.remove(tagName);
            card.tags.disableUpdates = false;
        }
        boardUI.hub.onCardTaskAdded = function (cardId, task) {
            var card = ui.boardUI.findCardById(cardId);
            card.onCardTaskAdded(task);
            card.totalTaskCount(card.totalTaskCount() + 1);
        }
        boardUI.hub.onCardTaskUpdated = function (cardId, task) {
            var card = ui.boardUI.findCardById(cardId);
            card.onCardTaskUpdated(task);
        }
        boardUI.hub.onCardTaskDeleted = function (cardId, cardTaskId) {
            var card = ui.boardUI.findCardById(cardId);
            card.onCardTaskDeleted(cardTaskId);
            card.totalTaskCount(card.totalTaskCount() - 1);
        }
        boardUI.hub.onCardTaskCompleted = function (cardId, task) {
            var card = ui.boardUI.findCardById(cardId);
            card.onCardTaskCompleted(task);
            card.completedTaskCount(card.completedTaskCount() + 1);
        }
        boardUI.hub.onCardTaskUncompleted = function (cardId, cardTaskId) {
            var card = ui.boardUI.findCardById(cardId);
            card.onCardTaskUncompleted(cardTaskId);
            card.completedTaskCount(card.completedTaskCount() - 1);
        }
        boardUI.hub.onColumnAdded = function (column) {
            ui.boardUI.columns.insert(new Column(column, ui.boardUI), column.sequence);
        }
        boardUI.hub.onColumnDeleted = function (columnId) {
            var column = ui.boardUI.columns.findByProperty('columnId', columnId);
            ui.boardUI.columns.remove(column);
        }
        boardUI.hub.onColumnVisibilityChanged = function (columnId, visible) {
            var column = ui.boardUI.columns.findByProperty('columnId', columnId);
            column.show(visible);
        }
        boardUI.hub.onColumnMoved = function (columnId, sequence) {
            var column = ui.boardUI.columns.findByProperty('columnId', columnId);
            ui.boardUI.columns.remove(column);
            ui.boardUI.columns.insert(column,sequence-1);
        }
        boardUI.hub.onColumnNameChanged = function (columnId, name) {
            var column = ui.boardUI.columns.findByProperty('columnId', columnId);
            column.name(name);
        }


        boardUI.hub.start(model.boardId);

        if (cardId != null) {
            $.boardcontext.current.openCardById(cardId);
            cardId = null;
        }

        ko.bindingHandlers.sortable.isEnabled = $.boardcontext.current.hasAccess('RearrangeCards');
    
    }

    

}());