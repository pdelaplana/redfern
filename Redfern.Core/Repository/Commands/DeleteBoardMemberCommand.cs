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
       

        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            BoardMember member = db.BoardMembers.Find(this.BoardMemberId);
           
            // set activity
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("removed");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("member", member.BoardMemberId.ToString(), userCache.GetFullName(member.UserName), String.Format(@"/profile/{0}", member.UserName));
            activity.SetContext("board", member.BoardId.ToString(), member.Board.Name, String.Format(@"/board/{0}", member.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> removed <a href=""{2}"">{3}</a> from board <a href=""{4}"">{5}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName,
                    activity.ContextUrl,
                    activity.ContextDisplayName
                ));
            activity = db.Activities.Add(activity);
     
            db.BoardMembers.Remove(member);
            db.SaveChanges();

            return true;
        }
    }
}
