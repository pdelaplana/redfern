using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class NotificationViewModel
    {
        public int NotificationId { get; set; }

        public DateTime NotificationDate { get; set; }

        public int? DaysToExpiry { get; set; }

        public DateTime? ReadDate { get; set; }

        public string SenderUser { get; set; }
        public string SenderUserFullName { get; set; }

        public string RecipientUser { get; set; }
        public string RecipientUserFullName { get; set; }

        public string Message { get; set; }

        public string NotificationType { get; set; }

        public string ObjectType { get; set; }
        public string ObjectId { get; set; }
        public string ObjectDesription { get; set; }
    }
}