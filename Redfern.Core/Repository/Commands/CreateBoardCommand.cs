using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Security;

namespace Redfern.Core.Repository.Commands
{
    public class CreateBoardCommand : IRepositoryCommand<Board>
    {
        public string Name { get; set; }

        public Board Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Board board = db.Boards.Create();
            board.Name = this.Name;
            board.Owner = db.Context.ClientUserName;
            board = db.Boards.Add(board);
            db.SaveChanges();

            BoardColumn archivedColumn = db.BoardColumns.Create();
            archivedColumn.BoardId = board.BoardId;
            archivedColumn.Name = "Archived";
            archivedColumn.Sequence = 1;
            archivedColumn.Hidden = true;
            archivedColumn = db.BoardColumns.Add(archivedColumn);
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("create");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("board", board.BoardId.ToString(), board.Name, String.Format(@"/board/{0}", board.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> created new board <a href=""{2}"">{3}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName
                ));
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return board;
        }

        
    }
}
