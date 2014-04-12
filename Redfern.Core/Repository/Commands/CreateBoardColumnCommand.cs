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
            Board board = db.Boards.Find(this.BoardId);

            BoardColumn archiveColumn = board.Columns.Where(c => c.Name == "Archived").SingleOrDefault();
            
            BoardColumn column = db.BoardColumns.Create();
            column.BoardId = this.BoardId;
            column.Name = this.Name;
            column.Sequence = archiveColumn != null ? archiveColumn.Sequence : board.Columns.Count-1;
            column.Hidden = false;
            column.Expanded = true;
            column = db.BoardColumns.Add(column);

            if (archiveColumn != null)
                archiveColumn.Sequence++;

            db.SaveChanges();

            return column;
        }
    }
}
