using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public enum NotificationType
    {
        AssignCard,
        NewCommentPosted
    }

    public class Notification: Auditable
    {
        [Key, Required]
        public int NotificationId { get; set; }

        public DateTime NotificationDate { get; set; }

        public int? DaysToExpiry { get; set; }

        public DateTime? ReadDate { get; set; }

        [Required, MaxLength(20)]
        public string SenderUser { get; set; }

        [Required, MaxLength(20)]
        public string RecipientUser { get; set; }

        [Required]
        public NotificationType NotificationType { get; set; }

        [Required, MaxLength(150)]
        public string Message { get; set; }

        [MaxLength(30)]
        public string ObjectType { get; set; }

        [MaxLength(30)]
        public string ObjectId { get; set; }
        
        [MaxLength(100)]
        public string ObjectDescription { get; set; }


    }
}
