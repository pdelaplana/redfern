using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.API.DTO
{
    public class BoardColumnDTO
    {
        public int ColumnId { get; set; }
        public int BoardId { get; set; }
        public string Name { get; set; }
        public int Sequence { get; set; }
        public bool Hidden { get; set; }
        public bool Expanded { get; set; }
    }
}