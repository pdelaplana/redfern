function BoardHubClient() {
    var self = this,
        boardHub = $.connection.boardHub;

    // define client functions that will be called by the signalr hub
    (function () {
        boardHub.client.displayMessage = function (message) {
            $.Notify.show(message.replace(/(<([^>]+)>)/ig, ""));
        };
        boardHub.client.addToActivityStream = function (activityListItem) {
            var activity = new BoardActivity(activityListItem);
            $.boardcontext.current.activities.insert(activity, 0);
            $.boardcontext.current.newActivitiesCounter($.boardcontext.current.newActivitiesCounter() + 1);
            $.boardcontext.utils.saveLastActivityId(activityListItem.activityId);
        }
        boardHub.client.onBoardNameChanged = function (name) {
            $.boardcontext.current.name(name);
            app.ui.appNavigationBar.updateBoardName($.boardcontext.current.boardId(), $.boardcontext.current.name());
            app.ui.appNavigationBar.selectedMenu($.boardcontext.current.name());
        }
        boardHub.client.onBoardVisibilityChanged = function (isPublic) {
            $.boardcontext.current.isPublic(isPublic);
            app.ui.appNavigationBar.updateBoardName($.boardcontext.current.boardId(), $.boardcontext.current.name());
            app.ui.appNavigationBar.selectedMenu($.boardcontext.current.name());
        }
        boardHub.client.onBoardArchived = function () {
            app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
            app.router.go('/#/boards');
        }
        boardHub.client.onBoardDeleted = function () {
            app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
            app.router.go('/#/boards');
        }
        boardHub.client.onCollaboratorAdded = function (boardMember) {
            $.boardcontext.current.members.push(new BoardMember(boardMember))
        }
        boardHub.client.onCollaboratorRemoved = function (userName) {
            var member = $.boardcontext.current.members.findByProperty('userName', userName);
            $.boardcontext.current.members.remove(member);
            // current user has been remomved, so boot him out of the board
            if (app.user.userName == userName) {
                app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
                app.router.go('/#/boards');
            }
        }
        boardHub.client.onColorLabelChanged = function (cardTypeData) {
            var cardType = $.boardcontext.current.cardTypes.findByProperty('cardTypeId', cardTypeData.cardTypeId);
            cardType.name(cardTypeData.name);
            // update all cards where name of cardtype may have changed
            $.boardcontext.utils.changeCardLabels(cardTypeData.cardTypeId, cardTypeData.name);
        }
        boardHub.client.onCardAdded = function (card) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', card.columnId);
            column.cards.push(new Card(card, column));
        }
        boardHub.client.onCardUpdated = function (card) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', card.columnId);
            if (column != null) {
                var cardToUpdate = column.cards.findByProperty('cardId', card.cardId);
                if (cardToUpdate != null) {
                    cardToUpdate.title(card.title);
                    cardToUpdate.description(card.description);
                }
            }
        }
        boardHub.client.onCardDeleted = function (columnId, cardId) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', columnId);
            if (column != null) {
                var cardToDelete = column.cards.findByProperty('cardId', cardId);
                if (cardToDelete != null) {
                    // ensure that card does a clean up (i.e. if opened and viewed by another collaborator)
                    cardToDelete.onDeleted();
                    column.cards.remove(cardToDelete);
                }
            }
        }
        boardHub.client.onCardMoved = function (card) {
            var cardToMove;
            $.each(ui.boardUI.columns(), function (index, column) {
                $.each(column.cards(), function (index, cardInColumn) {
                    if (cardInColumn.cardId() == card.cardId) {
                        column.cards.remove(cardInColumn);
                        return false;
                    }
                })
            })
            var targetColumn = $.boardcontext.current.columns.findByProperty('columnId', card.columnId);
            targetColumn.cards.insert(new Card(card, targetColumn), card.sequence);
        }
        boardHub.client.onCardAssigned = function (card) {
            var cardFound = $.boardcontext.current.findCardById(card.cardId);
            cardFound.assignedToUser(card.assignedToUser);
            cardFound.assignedToUserFullName(card.assignedToUserFullName);
        }
        boardHub.client.onCardCommentAdded = function (cardComment) {
            var card = $.boardcontext.current.findCardById(cardComment.cardId);
            card.onCommentAdded(cardComment);
            card.commentCount(card.commentCount() + 1);
        }
        boardHub.client.onCardCommentRemoved = function (cardId, commentId) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onCommentRemoved(commentId);
            card.commentCount(card.commentCount() - 1);
        }
        boardHub.client.onCardCommentUpdated = function (cardComment) {
            var card = $.boardcontext.current.findCardById(cardComment.cardId);
            card.onCommentUpdated(cardComment);
        }
        boardHub.client.onCardAttachmentAdded = function (attachment) {
            var card = $.boardcontext.current.findCardById(attachment.cardId);
            card.onAttachmentAdded(attachment);
            card.attachmentCount(card.attachmentCount() + 1);
        }
        boardHub.client.onCardAttachmentRemoved = function (cardId, attachmentId) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onAttachmentRemoved(attachmentId);
            card.attachmentCount(card.attachmentCount() - 1);
        }
        boardHub.client.onCardColorChanged = function (cardId, cardTypeId, label, color) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.cardTypeId(cardTypeId);
            card.cardLabel(label);
            card.color(color);
        }
        boardHub.client.onCardDueDateChanged = function (cardId, dueDate) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.dueDate(dueDate);
        }
        boardHub.client.onCardTagAdded = function (cardId, tagName) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.tags.disableUpdates = true;
            card.tags.push(tagName);
            card.tags.disableUpdates = false;
        }
        boardHub.client.onCardTagRemoved = function (cardId, tagName) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.tags.disableUpdates = true;
            card.tags.remove(tagName);
            card.tags.disableUpdates = false;
        }
        boardHub.client.onCardTaskAdded = function (cardId, task) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onCardTaskAdded(task);
            card.totalTaskCount(card.totalTaskCount() + 1);
        }
        boardHub.client.onCardTaskUpdated = function (cardId, task) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onCardTaskUpdated(task);
        }
        boardHub.client.onCardTaskDeleted = function (cardId, cardTaskId) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onCardTaskDeleted(cardTaskId);
            card.totalTaskCount(card.totalTaskCount() - 1);
        }
        boardHub.client.onCardTaskCompleted = function (cardId, task) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onCardTaskCompleted(task);
            card.completedTaskCount(card.completedTaskCount() + 1);
        }
        boardHub.client.onCardTaskUncompleted = function (cardId, cardTaskId) {
            var card = $.boardcontext.current.findCardById(cardId);
            card.onCardTaskUncompleted(cardTaskId);
            card.completedTaskCount(card.completedTaskCount() - 1);
        }
        boardHub.client.onColumnAdded = function (column) {
            $.boardcontext.current.columns.insert(new Column(column, ui.boardUI), column.sequence);
        }
        boardHub.client.onColumnDeleted = function (columnId) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', columnId);
            ui.boardUI.columns.remove(column);
        }
        boardHub.client.onColumnVisibilityChanged = function (columnId, visible) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', columnId);
            column.show(visible);
        }
        boardHub.client.onColumnMoved = function (columnId, sequence) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', columnId);
            ui.boardUI.columns.remove(column);
            ui.boardUI.columns.insert(column, sequence - 1);
        }
        boardHub.client.onColumnNameChanged = function (columnId, name) {
            var column = $.boardcontext.current.columns.findByProperty('columnId', columnId);
            column.name(name);
        }
    })();
    
    self.notify = boardHub.server;
    self.connectionId = '';
    self.boardId = 0;

    self.sendColumnHiddenNotification = function (column) {
        boardHub.server.onColumnVisibilityChanged(column);
    }

    self.subscribe = function (boardId) {
        self.boardId = boardId;
        boardHub.server.subscribe(boardId);
    }

    self.unsubscribe = function () {
        if (boardHub != null)
            boardHub.server.unsubscribe(self.boardId);
    }

    self.stop = function () {
        if (self.connected)
            $.connection.hub.stop();
    }
   
}