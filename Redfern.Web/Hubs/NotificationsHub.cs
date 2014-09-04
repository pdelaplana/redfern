using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
using Redfern.Web.Models;


namespace Redfern.Web.Hubs
{
    public class NotificationsHub : Hub
    {
        private IRedfernRepository _repository;

        public NotificationsHub(IRedfernRepository repository)
        {
            _repository = repository;
        }

        public NotificationsHub() { }

        public void Hello()
        {
            Clients.All.hello();
        }

        public void Subscribe(string userName)
        {
            Groups.Add(Context.ConnectionId, userName);
        }

        public void UnSubscribe(string userName)
        {
            Groups.Remove(Context.ConnectionId, userName);
        }

        public void notifyNewAssignment(int cardId, string sender, string recipient)
        {
            var repository = DependencyResolver.Current.GetService<IRedfernRepository>();
            Card card = repository.Cards.Where(c => c.CardId  == cardId).SingleOrDefault();
            CreateNotificationCommand command = new CreateNotificationCommand
            {
                SenderUser = sender,
                RecipientUser = recipient,
                Message = "assigned you a card",
                NotificationType = NotificationType.AssignCard,
                ObjectType = "card",
                ObjectId = String.Format("BoardId={0};CardId={1}", card.BoardId.ToString(), card.CardId.ToString())
            };
            var result = repository.ExecuteCommand(command);
            Clients.Group(recipient).notify(AutoMapper.Mapper.Map<Notification, NotificationItem>(result.Data));
        }

        public void NotifyNewCommentPosted(int cardId, string sender)
        {
            var repository = DependencyResolver.Current.GetService<IRedfernRepository>();
            Card card = repository.Get<Card>(cardId);
            
            //send a notification to card assignee that a new comment has been posted
            if (!String.IsNullOrEmpty(card.AssignedToUser) && card.AssignedToUser != sender)
            {
                CreateNotificationCommand command = new CreateNotificationCommand
                {
                    SenderUser = sender,
                    RecipientUser = card.AssignedToUser,
                    Message = "posted comment to your card.",
                    NotificationType = NotificationType.NewCommentPosted,
                    ObjectType = "card",
                    ObjectId = String.Format("BoardId={0};CardId={1}", card.BoardId.ToString(), card.CardId.ToString())
                };
                var result = repository.ExecuteCommand(command);
                Clients.Group(card.AssignedToUser).notify(AutoMapper.Mapper.Map<Notification, NotificationItem>(result.Data));
            }
            
        }

    }
}