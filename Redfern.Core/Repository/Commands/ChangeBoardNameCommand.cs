using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class ChangeBoardNameCommand : IRepositoryCommand<Board>
    {
        
        public int BoardId { get; set; }
        public string Name { get; set; }

        public CommandResult<Board> Execute(RedfernDb db)
        {
            string oldName = "";
            Board board = db.Boards.Find(this.BoardId);
            oldName = board.Name;
            board.Name = this.Name;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("renamed");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("board", board.BoardId.ToString(), board.Name, String.Format(@"/board/{0}", board.BoardId));
            activity.SetDescription("{actorlink} renamed {object}.");
            activity = db.Activities.Add(activity);
            db.SaveChanges();
            
            return this.CommandResult<Board>(board, db, activity);

            
        }

        
    }
}
