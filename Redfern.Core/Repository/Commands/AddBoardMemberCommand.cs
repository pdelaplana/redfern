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

        public CommandResult<BoardMember> Execute(RedfernDb db)
        {
            Activity activity = null;
            BoardMember member = db.BoardMembers.Where(m => m.BoardId == this.BoardId && m.UserName == this.UserName).SingleOrDefault();

            if (member == null) 
            {
                member = db.BoardMembers.Create();
                member.BoardId = this.BoardId;
                member.UserName = this.UserName;
                member = db.BoardMembers.Add(member);
                db.SaveChanges();

                activity = db.Activities.Create();
                activity.ActivityDate = DateTime.UtcNow;
                activity.SetVerb("inlcuded");
                activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
                activity.SetObject("member", member.BoardMemberId.ToString(), db.GetUserFullName(member.UserName), String.Format(@"/profile/{0}", member.UserName));
                activity.SetContext("board", member.BoardId.ToString(), member.Board.Name, String.Format(@"/board/{0}", member.BoardId));
                activity.SetDescription("{actorlink} included member {object} to {context}");
                activity = db.Activities.Add(activity);
                db.SaveChanges();

            }
            else
            {

            }

            return this.CommandResult<BoardMember>(member, db, activity);

        }
    }
}
