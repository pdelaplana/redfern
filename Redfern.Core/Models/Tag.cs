using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class Tag : Auditable
    {
        [Key]
        public int TagId { get; set; }

        [MaxLength(20)]
        public string TagName { get; set; }

        [Required]
        public int BoardId { get; set; }
        public Board Board { get; set; }

    }
}
