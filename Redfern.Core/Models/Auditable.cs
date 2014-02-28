using System;
using System.ComponentModel.DataAnnotations;

namespace Redfern.Core.Models
{
    public abstract class Auditable
    {
        [Required]
        public int TenantId { get; set; }

        [Required]
        [StringLength(20)]
        public string CreatedByUser { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        [StringLength(20)]
        public string ModifiedByUser { get; set; }

        [Required]
        public DateTime ModifiedDate { get; set; }

    }
}
