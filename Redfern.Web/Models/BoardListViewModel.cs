using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class BoardListItem {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public DateTime? ArchiveDate { get; set; }
    }

    public class BoardListViewModel
    {
        public IList<BoardListItem> Boards { get; set; }
    }
}