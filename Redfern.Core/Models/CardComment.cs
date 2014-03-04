﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class CardComment : Auditable
    {
        [Key]
        public int CommentId { get; set; }

        public int CardId { get; set; }
        public virtual Card Card { get; set; }

        [MaxLength(250)]
        public string Comment { get; set; }

        [MaxLength(20)]
        public string CommentByUser { get; set; }

        public DateTime CommentDate { get; set; }

    }
}