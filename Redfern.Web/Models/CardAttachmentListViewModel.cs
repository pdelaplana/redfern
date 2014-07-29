using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class CardAttachmentListItem 
    {
        public int CardId { get; set; }
        public int CardAttachmentId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public DateTime UploadDate { get; set; }
        public string UploadByUserFullName { get; set; }
    }
    public class CardAttachmentListViewModel
    {
        public IList<CardAttachmentListItem> Attachments { get; set; }
    }
}