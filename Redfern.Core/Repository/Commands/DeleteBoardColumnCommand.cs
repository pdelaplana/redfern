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
    public class DeleteBoardColumnCommand : IRepositoryCommand<bool>
    {
        public int ColumnId { get; set; }
        
        public CommandResult<bool> Execute(RedfernDb db)
        {
            BoardColumn column = db.BoardColumns.Find(this.ColumnId);

            try
            {
                Activity activity = db.Activities.Create();
                activity.ActivityDate = DateTime.UtcNow;
                activity.SetVerb("deleted");
                activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
                activity.SetObject("column", column.ColumnId.ToString(), column.Name, "");
                activity.SetContext("board", column.BoardId.ToString(), column.Board.Name, String.Format(@"/board/{0}", column.BoardId));
                activity.SetDescription("{actorlink} deleted column {object} in {context}");
                activity = db.Activities.Add(activity);
                db.SaveChanges();

                db.BoardColumns.Remove(column);
                db.SaveChanges();

                return this.CommandResult<bool>(true, db, activity);

            }
            catch
            {
                return this.CommandResult<bool>(false, db);
            }
          

            
           
            
        }
    }
}
