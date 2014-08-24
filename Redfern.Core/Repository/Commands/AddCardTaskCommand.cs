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
    public class AddCardTaskCommand : IRepositoryCommand<CardTask>
    {

        public int CardId { get; set; }
        public string Description { get; set; }
        public string AssignedToUser { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string TaskNotes { get; set; }

        public CommandResult<CardTask> Execute(RedfernDb db)
        {
            CardTask task = db.CardTasks.Create();
            task.CardId = this.CardId;
            task.Description = this.Description;
            task.AssignedToUser = this.AssignedToUser;
            task.AssignedDate = this.AssignedDate;
            task.DueDate = this.DueDate;
            task.TaskNotes = this.TaskNotes;
            db.CardTasks.Add(task);
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("added");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("task", task.CardTaskId.ToString(), task.Description.Substring(0, task.Description.Length < 30 ? task.Description.Length - 1 : 25), "");
            activity.SetTarget("card", task.CardId.ToString(), task.Card.Title, String.Format(@"#/board/{0}/card/{1}", task.Card.BoardId.ToString(), task.CardId.ToString()));
            activity.SetContext("board", task.Card.BoardId.ToString(), task.Card.Board.Name, String.Format(@"/board/{0}", task.Card.BoardId));
            activity.SetDescription("{actorlink} added task {objectlink} to card {targetlink} in {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<CardTask>(task, db, activity);

        }
    }
}
