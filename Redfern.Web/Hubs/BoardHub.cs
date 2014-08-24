using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Redfern.Web.API;
using Redfern.Web.Models;

namespace Redfern.Web.Hubs
{

    public class BoardHub : Hub
    {

        public void Hello(int boardId)
        {
            Clients.Group(boardId.ToString()).hello("Hello World!!!");
        }

        public void Subscribe(int boardId)
        {
            Groups.Add(Context.ConnectionId, boardId.ToString());
        }

        public void DisplayMessage(int boardId, string message)
        {
            Clients.OthersInGroup(boardId.ToString()).displayMessage(message);
        }

        public void AddToActivityStream(int boardId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
        }

        public void OnBoardNameChanged(int boardId, string name, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onBoardNameChanged(name);
        }

        public void OnBoardVisibilityChanged(int boardId, bool isPublic, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onBoardVisibilityChanged(isPublic);
        }

        public void OnBoardArchived(int boardId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onBoardArchived();
        }

        public void OnBoardDeleted(int boardId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onBoardDeleted();
        }

        public void OnCollaboratorAdded(int boardId, BoardMemberItem boardMember, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCollaboratorAdded(boardMember);
        }

        public void OnCollaboratorRemoved(int boardId, string collaboratorName, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCollaboratorRemoved(collaboratorName);
        }

        public void OnColorLabelChanged(int boardId, CardTypeItem cardType, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onColorLabelChanged(cardType);
        }

        public void OnCardAdded(CardItem card, ActivityListItem activity)
        {
            Clients.Group(card.BoardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(card.BoardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(card.BoardId.ToString()).onCardAdded(card);
        }

        public void OnCardUpdated(CardItem card, ActivityListItem activity)
        {
            Clients.Group(card.BoardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(card.BoardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(card.BoardId.ToString()).onCardUpdated(card);
        }

        public void OnCardDeleted(int boardId, int columnId, int cardId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardDeleted(columnId, cardId);
        }

        public void OnCardMoved(CardItem card, ActivityListItem activity)
        {
            Clients.Group(card.BoardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(card.BoardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(card.BoardId.ToString()).onCardMoved(card);
        }

        public void OnCardAssigned(CardItem card, ActivityListItem activity)
        {
            Clients.Group(card.BoardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(card.BoardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(card.BoardId.ToString()).onCardAssigned(card);
        }

        public void OnCardCommentAdded(int boardId, CardCommentViewModel cardComment, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardCommentAdded(cardComment);
        }

        public void OnCardCommentRemoved(int boardId, int cardId, int commentId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardCommentRemoved(cardId, commentId);
        }

        public void OnCardCommentUpdated(int boardId, CardCommentViewModel cardComment, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardCommentUpdated(cardComment);
        }

        public void OnCardAttachmentAdded(int boardId, CardAttachmentListItem cardAttachmentListItem, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardAttachmentAdded(cardAttachmentListItem);
        }

        public void OnCardAttachmentRemoved(int boardId, int cardId, int commentId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardCommentRemoved(cardId, commentId);
        }


        public void OnCardTagAdded(int boardId, int cardId, string tagName, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTagAdded(cardId, tagName);
        }

        public void OnCardTagRemoved(int boardId, int cardId, string tagName, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTagRemoved(cardId, tagName);
        }

        public void OnCardColorChanged(int boardId, int cardId, int cardTypeId, string label, string color, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardColorChanged(cardId, cardTypeId, label, color);
        }

        public void OnCardDueDateChanged(int boardId, int cardId, DateTime? dueDate, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardDueDateChange(cardId, dueDate);
        }

        public void OnCardTaskAdded(int boardId, int cardId, CardTaskViewModel task, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTaskAdded(cardId, task);
        }

        public void OnCardTaskUpdated(int boardId, int cardId, CardTaskViewModel task, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTaskUpdated(cardId, task);
        }

        public void OnCardTaskDeleted(int boardId, int cardId, int cardTaskId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTaskDeleted(cardId, cardTaskId);
        }

        public void OnCardTaskCompleted(int boardId, int cardId, CardTaskViewModel task, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTaskCompleted(cardId, task);
        }

        public void OnCardTaskUncompleted(int boardId, int cardId, int cardTaskId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onCardTaskUncompleted(cardId, cardTaskId);
        }

        public void OnColumnAdded(BoardColumnItem column, ActivityListItem activity)
        {
            Clients.Group(column.BoardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(column.BoardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(column.BoardId.ToString()).onColumnAdded(column);
        }

        public void OnColumnDeleted(int boardId, int columnId, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onColumnDeleted(columnId);
        }

        public void OnColumnVisibilityChanged(int boardId, int columnId, bool visible, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onColumnVisibilityChanged(columnId, visible);
        }

        public void OnColumnMoved(BoardColumnItem column, ActivityListItem activity)
        {
            Clients.Group(column.BoardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(column.BoardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(column.BoardId.ToString()).onColumnMoved(column.ColumnId, column.Sequence);
        }

        public void onColumnNameChanged(int boardId, int columnId, string name, ActivityListItem activity)
        {
            Clients.Group(boardId.ToString()).addToActivityStream(activity);
            Clients.OthersInGroup(boardId.ToString()).displayMessage(activity.Description);
            Clients.OthersInGroup(boardId.ToString()).onColumnNameChanged(columnId, name);
        }

    }
}