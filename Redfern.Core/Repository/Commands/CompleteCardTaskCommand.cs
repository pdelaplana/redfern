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
    public class CompleteCardTaskCommand : IRepositoryCommand<CardTask>
    {

        public int CardTaskId { get; set; }
        public string CompletedByUser { get; set; }
        public DateTime? CompletedDate { get; set; }
        
        public CommandResult<CardTask> Execute(RedfernDb db)
        {
            CardTask task = db.CardTasks.Find(this.CardTaskId);
            task.CompletedByUser = this.CompletedByUser;
            task.CompletedDate = this.CompletedDate;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            if (this.CompletedDate.HasValue)
                activity.SetVerb("checked");
            else
                activity.SetVerb("unchecked");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("task", task.CardTaskId.ToString(), task.Description.Substring(0, task.Description.Length < 30 ? task.Description.Length - 1 : 25), "");
            activity.SetTarget("card", task.CardId.ToString(), task.Card.Title, String.Format(@"#/board/{0}/card/{1}", task.Card.BoardId.ToString(), task.CardId.ToString()));
            activity.SetContext("board", task.Card.BoardId.ToString(), task.Card.Board.Name, String.Format(@"/board/{0}", task.Card.BoardId));
            if (this.CompletedDate.HasValue)
                activity.SetDescription("{actorlink} checked task {object} in card {targetlink} in {contextlink}");
            else
                activity.SetDescription("{actorlink} unchecked task {object} in card {targetlink} in {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<CardTask>(task, db, activity);

        }
    }
}
