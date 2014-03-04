﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class Card : Auditable
    {
        [Key]
        public int CardId { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; }

        [MaxLength]
        public string Description { get; set; }

        public int BoardId { get; set; }
        [ForeignKey("BoardId")]
        public virtual Board Board { get; set; }

        public int ColumnId { get; set; }
        [ForeignKey("ColumnId")]
        public virtual BoardColumn Column { get; set; }

        public int ColumnPosition { get; set; }

        [MaxLength(20)]
        public string AssignedToUser { get; set; }

        public virtual ICollection<CardTag> Tags { get; set; }

        public virtual ICollection<CardComment> Comments { get; set; }

        public virtual ICollection<CardTask> Tasks { get; set; }

    }

}