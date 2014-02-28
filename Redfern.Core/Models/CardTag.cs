using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class CardTag : Auditable
    {
        [Key]
        public int CardTagId { get; set; }

        public int CardId { get; set; }
        public virtual Card Card { get; set; }

        public int TagId { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
