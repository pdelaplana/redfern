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
    public class AddBoardMemberCommand : IRepositoryCommand<BoardMember>
    {

        public int BoardId { get; set; }
        public string UserName { get; set; }

        public BoardMember Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {

            BoardMember member = db.BoardMembers.Create();
            member.BoardId = this.BoardId;
            member.UserName = this.UserName;
            member = db.BoardMembers.Add(member);
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("added");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("member", member.BoardMemberId.ToString(), userCache.GetFullName(member.UserName), String.Format(@"/profile/{0}", member.UserName));
            activity.SetContext("board", member.BoardId.ToString(), member.Board.Name, String.Format(@"/board/{0}", member.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> added <a href=""{2}"">{3}</a> to board <a href=""{4}"">{5}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName,
                    activity.ContextUrl,
                    activity.ContextDisplayName
                ));
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return member;
        }
    }
}
