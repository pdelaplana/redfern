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
    public class DeleteBoardMemberCommand : IRepositoryCommand<bool>
    {

        public int BoardMemberId { get; set; }

        public CommandResult<bool> Execute(RedfernDb db)
        {
            BoardMember member = db.BoardMembers.Find(this.BoardMemberId);
            if (member == null) return this.CommandResult<bool>(false, db, "Member not found.");
           
            // else

            // create the activity
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("removed");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("member", member.BoardMemberId.ToString(), db.GetUserFullName(member.UserName), String.Format(@"/profile/{0}", member.UserName));
            activity.SetContext("board", member.BoardId.ToString(), member.Board.Name, String.Format(@"/board/{0}", member.BoardId));
            activity.SetDescription("{actorlink} removed {object} from board {contextlink}");
            activity = db.Activities.Add(activity);
            
            // remove board member
            db.BoardMembers.Remove(member);
            db.SaveChanges();

            return this.CommandResult<bool>(true, db, activity);
            
        }
    }
}
