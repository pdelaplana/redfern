using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{

    public enum BoardMemberRole
    {
        Owner,
        Contributor,
        Viewer
    }

    public class BoardMember : Auditable
    {
        [Key]
        public int BoardMemberId { get; set; }

        public int BoardId { get; set; }
        [ForeignKey("BoardId")]
        public virtual Board Board { get; set; }

        [Required, MaxLength(20)]
        public string UserName { get; set; }

        public BoardMemberRole Role { get; set; }
    }
}
