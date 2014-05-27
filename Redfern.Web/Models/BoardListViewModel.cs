using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class BoardListItem {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string OwnerFullName { get; set; }
        public bool IsPublic { get; set; }
        public string[] Collaborators { get; set; }
        public DateTime? ArchiveDate { get; set; }
        public int CardCount { get; set; }
    }

    public class BoardListViewModel
    {
        public IList<BoardListItem> Boards { get; set; }
    }
}