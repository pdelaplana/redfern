using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public class CardAttachment : Auditable
    {
        [Key]
        public int CardAttachmentId { get; set; }
        
        public int CardId { get; set; }
        public virtual Card Card { get; set; }

        [StringLength(50)]
        public string FileName { get; set; }

        [StringLength(5)]
        public string FileExtension { get; set;}

        [StringLength(40)]
        public string ContentType { get; set; }

        public byte[] FileContent { get; set; }

    }
}
