function Card(data, column) {
    var self = this;

    self.parent = column;
    self.cardId = ko.observable(data.cardId);
    self.title = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.cardTypeId = ko.observable(data.cardTypeId);
    self.cardLabel = ko.observable(data.cardLabel);
    self.color = ko.observable(data.color);
    self.createdByUserFullName = ko.observable(data.createdByUserFullName);
    self.createdDate = ko.observable(data.createdDate);
    self.assignedToUser = ko.observable(data.assignedToUser);
    self.assignedToUserFullName = ko.observable(data.assignedToUserFullName);
    self.dueDate = ko.observable(data.dueDate != null ? moment.utc(data.dueDate).toDate() : null);
    self.archivedDate = ko.observable(data.archivedDate);
    self.isArchived = ko.observable(data.isArchived);
    self.boardId = ko.observable(data.boardId);
    self.columnId = ko.observable(data.columnId);
    self.columnName = column.name;
    self.sequence = ko.observable(data.sequence);
    self.tags = ko.observableArray(data.tags)
    self.commentCount = ko.observable(data.commentCount);
    self.attachmentCount = ko.observable(data.attachmentCount);
    self.completedTaskCount = ko.observable(data.completedTaskCount);
    self.totalTaskCount = ko.observable(data.totalTaskCount)

    self.show = ko.observable(true);

    self.createdDateInLocalTimezone = ko.computed(function () {
        return moment(moment.utc(self.createdDate()).toDate()).format('llll');
    })
    self.isArchived.subscribe(function (newValue) {
        self.show(!newValue);
    })

    // event handlers
    self.onCommentAdded = function (cardComment) { };
    self.onCommentUpdated = function (cardComment) { };
    self.onCommentRemoved = function (cardCommentId) { };
    self.onAttachmentAdded = function (attachment) { };
    self.onAttachmentRemoved = function (attachmentId) { };
    self.onCardTaskAdded = function (cardTask) { }
    self.onCardTaskUpdated = function (cardTask) { }
    self.onCardTaskDeleted = function (cardTaskId) { }
    self.onCardTaskCompleted = function (cardTask) { }
    self.onCardTaskUncompleted = function (cardTaskId) { }

    self.onDeleted = function () { };

    //
    // open card properties dialog
    //
    self.open = function () {
        // close the dialog if one is open
        $.Dialog.close();

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
            dialog.attachmentsList.attachments.insert(new AttachmentListItem(attachment), 0);
        }
        self.onAttachmentRemoved = function (attachmentId) {
            dialog.attachmentsList.attachments.remove(dialog.attachmentsList.attachments.findByProperty('cardAttachmentId', attachmentId));
        }
        self.onCardTaskAdded = function (cardTask) {
            dialog.taskList.tasks.push(new CardTaskItem(cardTask));
        }
        self.onCardTaskUpdated = function (cardTask) {
            var task = dialog.taskList.tasks.findByProperty('cardTaskId', cardTask.cardTaskId);
            task.description(cardTask.description);
        }
        self.onCardTaskDeleted = function (cardTaskId) {
            var task = dialog.taskList.tasks.findByProperty('cardTaskId', cardTaskId);
            dialog.taskList.tasks.remove(task);
        }
        self.onCardTaskCompleted = function (cardTask) {
            var task = dialog.taskList.tasks.findByProperty('cardTaskId', cardTask.cardTaskId);
            task.completedByUser(cardTask.completedByUser);
            task.completedDate(cardTask.completedDate);
        }
        self.onCardTaskUncompleted = function (cardTaskId) {
            var task = dialog.taskList.tasks.findByProperty('cardTaskId', cardTaskId);
            task.completedByUser(null);
            task.completedDate(null);
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

    self.move = function (fromColumn, toColumn) {


    }

    self.assign = function () {
        var repository = new CardRepository();
        repository.boardId = self.boardId();
        repository.cardId = self.cardId();
        repository.assignedToUser = self.assignedToUser();
        return repository.assign().done(function (result) {
            self.assignedToUser(result.data.assignedToUser);
            self.assignedToUserFullName(result.data.assignedToUserFullName);
            $.boardcontext.current.hub.notify.onCardAssigned(result.data, result.activityContext);
            if (app.user.userName != result.data.assignedToUser) {
                $.hubclientcontext.notificationsHub.notifyNewAssignment(self.cardId(), app.user.userName, result.data.assignedToUser);
            }
        });
    }

}
