using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class ResequenceBoardColumnsCommand : IRepositoryCommand<BoardColumn>
    {

        public int BoardId { get; set; }
        public int MovedColumnId { get; set; }
        public int[] ColumnIds { get; set; }

        public CommandResult<BoardColumn> Execute(RedfernDb db)
        {
            int counter = 1;
            BoardColumn column, movedColumn = null;
            
            foreach (var id in ColumnIds)
            {
                column = db.BoardColumns.Find(id);
                if (MovedColumnId == column.ColumnId) movedColumn = column; 
                column.Sequence = counter;
                counter++;
            }
            db.SaveChanges();

            return this.CommandResult<BoardColumn>(movedColumn, db, CreateMoveColumnActivity(movedColumn, db));

        }

        private Activity CreateMoveColumnActivity(BoardColumn column, RedfernDb db)
        {
            // create an activity 
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("moved");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("column", column.ColumnId.ToString(), column.Name, "");
            activity.SetContext("board", column.BoardId.ToString(), column.Board.Name, String.Format(@"/board/{0}", column.BoardId));
            activity.SetDescription("{actor} moved card {object} in board {context}.");
            activity = db.Activities.Add(activity);
            db.SaveChanges();
            return activity;
        }
    }
}
