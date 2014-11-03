using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class CreateNotificationCommand : IRepositoryCommand<Notification>
    {
        public string SenderUser { get; set; }
        public string RecipientUser { get; set; }
        public string Message { get; set; }
        public NotificationType NotificationType { get; set; }
        public string ObjectType { get; set; }
        public string ObjectId { get; set; }
        public string ObjectDescription { get; set; }

        public CommandResult<Notification> Execute(RedfernDb db)
        {
            Notification notification = db.Notifications.Create();
            notification.NotificationDate = DateTime.UtcNow;
            notification.Message = this.Message;
            notification.SenderUser = this.SenderUser;
            notification.RecipientUser = this.RecipientUser;
            notification.NotificationType = this.NotificationType;
            notification.ObjectType = this.ObjectType;
            notification.ObjectId = this.ObjectId;
            notification.ObjectDescription = this.ObjectDescription;
            notification = db.Notifications.Add(notification);
            db.SaveChanges();

            return this.CommandResult<Notification>(notification, db, "New notification created.");

        }

        
    }
}
