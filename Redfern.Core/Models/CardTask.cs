﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class CardTask : Auditable
    {
        [Key]
        public int CardTaskId { get; set; }

        public int CardId { get; set; }
        public virtual Card Card { get; set; }

        [Required, MaxLength(200)]
        public string Description { get; set; }

        [MaxLength(20)]
        public string AssignedToUser { get; set; }

        public DateTime? AssignedDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [MaxLength(20)]
        public string CompletedByUser { get; set; }

        [MaxLength]
        public string TaskNotes { get; set; }


    }
}
