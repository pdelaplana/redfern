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
    public class ChangeBoardNameCommand : IRepositoryCommand<Board>
    {
        
        public int BoardId { get; set; }
        public string Name { get; set; }

        public Board Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            string oldName = "";
            Board board = db.Boards.Find(this.BoardId);
            oldName = board.Name;
            board.Name = this.Name;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("chnage");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("board", board.BoardId.ToString(), board.Name, String.Format(@"/board/{0}", board.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> changed name of board <b>{2}</b> to <a href=""{3}"">{4}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    oldName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName
                ));
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return board;
        }

        
    }
}
