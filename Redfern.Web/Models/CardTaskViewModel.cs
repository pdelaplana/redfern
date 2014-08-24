using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class CardTaskViewModel
    {
        public int CardTaskId { get; set; }
        public int CardId { get; set; }
        public string Description { get; set; }
        public string AssignedToUser { get; set; }
        public string AssignedToUserFullName { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string CompletedByUser { get; set; }
        public string CompletedByUserFullName { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string TaskNotes { get; set; }
    }
}