using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class DeleteNotificationCommand : IRepositoryCommand<bool>
    {
        public int NotificationId { get; set; }

        public CommandResult<bool> Execute(RedfernDb db)
        {
            Notification notification = db.Notifications.Find(this.NotificationId);
            db.Notifications.Remove(notification);
            db.SaveChanges();

            return this.CommandResult<bool>(true, db, "Notification deleted.");
            
        }
    }
}
