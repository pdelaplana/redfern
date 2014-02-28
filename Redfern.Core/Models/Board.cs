using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class Board : Auditable
    {
        [Key, Required]
        public int BoardId { get; set; }

        [Required, StringLength(50)]
        public string Name { get; set; }

        public DateTime? ArchiveDate { get; set; }

        public virtual ICollection<BoardMember> Members { get; set; }

        public virtual ICollection<BoardColumn> Columns { get; set; }

        public virtual ICollection<Card> Cards { get; set; }
        
    }
}
