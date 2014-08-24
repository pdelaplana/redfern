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
    public class DeleteCardTaskCommand : IRepositoryCommand<bool>
    {
        public int CardTaskId { get; set; }

        public CommandResult<bool> Execute(RedfernDb db)
        {
            CardTask task = db.CardTasks.Find(this.CardTaskId);
            
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("deleted");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("task", task.CardTaskId.ToString(), task.Description.Substring(0, task.Description.Length < 30 ? task.Description.Length - 1 : 25), "");
            activity.SetTarget("card", task.CardId.ToString(), task.Card.Title, String.Format(@"#/board/{0}/card/{1}", task.Card.BoardId.ToString(), task.CardId.ToString()));
            activity.SetContext("board", task.Card.BoardId.ToString(), task.Card.Board.Name, String.Format(@"/board/{0}", task.Card.BoardId));
            activity.SetDescription("<b>{actorlink}</b> deleted <b>{object}</b> from <b>{contextlink}</b>");
            activity = db.Activities.Add(activity);

            db.CardTasks.Remove(task);
            db.SaveChanges();

            return this.CommandResult<bool>(true, db, activity);
            
        }
    }
}
