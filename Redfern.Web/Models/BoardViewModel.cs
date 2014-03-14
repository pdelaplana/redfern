using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{

    public class CardItem
    {

        public int CardId { get; set; }
        public string Title { get; set; }
        public int BoardId { get; set; }
        public int ColumnId { get; set; }
        public int Sequence { get; set; }
        public string AssignedToUser { get; set; }
    }

    public class BoardColumnItem
    {
        public int BoardId { get; set; }
        public int ColumnId { get; set; }
        public string Name { get; set; }
        public int Sequence { get; set; }
        public bool Expanded { get; set; }
        public bool Hidden { get; set; }

        public IList<CardItem> Cards { get; set; }
    }

    public class BoardViewModel
    {
        public int BoardId { get; set; }
        public string Name { get; set; }

        public IList<BoardColumnItem> Columns { get; set; }
    }
}