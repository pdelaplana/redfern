using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Redfern.Core.Models
{
    public class BoardColumn : Auditable
    {
        [Key, Required]
        public int ColumnId { get; set; }

        [Required, MinLength(1), MaxLength(30)]
        public string Name { get; set; }

        public int BoardId { get; set; }
        [ForeignKey("BoardId")]
        public virtual Board Board { get; set;}

        public int Sequence { get; set; }

        public virtual ICollection<Card> Cards { get; set; }

        public bool Expanded { get; set; }

        public bool Hidden { get; set; }

    }
}
