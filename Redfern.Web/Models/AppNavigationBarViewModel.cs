using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{

    public class BoardMenuItem
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
    }

    public class AppNavigationBarViewModel
    {
        public IList<BoardMenuItem> Boards { get; set; }
    }
}