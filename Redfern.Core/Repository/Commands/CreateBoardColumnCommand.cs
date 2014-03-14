using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Security;

namespace Redfern.Core.Repository.Commands
{
    public class CreateBoardColumnCommand : IRepositoryCommand<BoardColumn>
    {

        public int BoardId { get; set; }
        public string Name { get; set; }
        public int Sequence { get; set; }

        public BoardColumn Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            BoardColumn column = db.BoardColumns.Create();
            column.BoardId = this.BoardId;
            column.Name = this.Name;
            column.Sequence = this.Sequence;
            column.Hidden = false;
            column.Expanded = true;
            column = db.BoardColumns.Add(column);
            db.SaveChanges();

            return column;
        }
    }
}
