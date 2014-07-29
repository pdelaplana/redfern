function BoardHubClient() {
    
    var self = this;

    self.notify = null;
    
    self.connectionId = '';

    // handle events from peers
    self.addToActivityStream = function (activityListItem) { };
    self.displayMessage = function (message) { $.Notify.show(message.replace(/(<([^>]+)>)/ig, "")); };

    self.onBoardNameChanged = function (name) { }
    self.onBoardVisibilityChanged = function (name) { }
    self.onBoardArchived = function () { }
    self.onBoardDeleted = function () { }

    self.onCollaboratorAdded = function (user) { }
    self.onCollaboratorRemoved = function (user) { }
    self.onColorLabelChanged = function(){}

    self.onCardAdded = function (card) { }
    self.onCardDeleted = function (cardId) { }
    self.onCardMoved = function (cardId, columnId, sequence) { }
    self.onCardUpdated = function (card) { }
    self.onCardAssigned = function (card) { }
    self.onCardAttachmentAdded = function (cardAttachment) { }
    self.onCardAttachmentRemoved = function (cardAttachment) { }
    self.onCardCommentAdded = function (cardComment) { }
    self.onCardCommentRemoved = function (cardId, commentId) { }
    self.onCardColorChanged = function (cardId, cardTypeId, color) { }
    self.onCardTagAdded = function (cardId, tagName) { }
    self.onCardTagRemoved = function (cardId, tagName) { }

    self.onColumnAdded = function (column) { }
    self.onColumnMoved = function (columnId, sequence) { }
    self.onColumnDeleted = function (columnId) { }
    self.onColumnVisibilityChanged = function (columnId, connectionId) { }
    self.onColumnNameChanged = function (columnId, name) { }

    var boardHub;

    self.sendColumnHiddenNotification = function (column) {
        boardHub.server.onColumnVisibilityChanged(column);
    }

    self.start = function (boardId) {
        // start signalr
        $.connection.hub.logging = true;
        boardHub = $.connection.boardHub;

        boardHub.client.hello = function () {
            alert('hello');
        }

        boardHub.client.displayMessage = self.displayMessage;
        boardHub.client.addToActivityStream = self.addToActivityStream;

        boardHub.client.onBoardNameChanged = self.onBoardNameChanged;
        boardHub.client.onBoardVisibilityChanged = self.onBoardVisibilityChanged;
        boardHub.client.onBoardArchived = self.onBoardArchived;
        boardHub.client.onBoardDeleted = self.onBoardDeleted;

        boardHub.client.onCollaboratorAdded = self.onCollaboratorAdded;
        boardHub.client.onCollaboratorRemoved = self.onCollaboratorRemoved;

        boardHub.client.onColorLabelChanged = self.onColorLabelChanged;


        boardHub.client.onColumnAdded = self.onColumnAdded;
        boardHub.client.onColumnDeleted = self.onColumnDeleted;
        boardHub.client.onColumnMoved = self.onColumnMoved;
        boardHub.client.onColumnVisibilityChanged = self.onColumnVisibilityChanged;
        boardHub.client.onColumnNameChanged = self.onColumnNameChanged;

        boardHub.client.onCardAdded = self.onCardAdded;
        boardHub.client.onCardDeleted = self.onCardDeleted;
        boardHub.client.onCardMoved = self.onCardMoved;
        boardHub.client.onCardUpdated = self.onCardUpdated;
        boardHub.client.onCardAssigned = self.onCardAssigned;
        boardHub.client.onCardAttachmentAdded = self.onCardAttachmentAdded;
        boardHub.client.onCardAttachmentRemoved = self.onCardAttachmentRemoved;
        boardHub.client.onCardCommentAdded = self.onCardCommentAdded;
        boardHub.client.onCardCommentRemoved = self.onCardCommentRemoved;
        boardHub.client.onCardColorChanged = self.onCardColorChanged;
        boardHub.client.onCardTagAdded = self.onCardTagAdded;
        boardHub.client.onCardTagRemoved = self.onCardTagRemoved;

        self.notify = boardHub.server;

        $.connection.hub.start()
            .done(function () {
                // Subscribe to changes to this board
                boardHub.server.subscribe(boardId);
            })
            .fail(function () {
                console.log("Could not Connect!");
            });

    }
    
   
}