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
    public class DeleteBoardCommand : IRepositoryCommand<bool>
    {
        public int BoardId { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Board board = db.Boards.Find(this.BoardId);

            // delete cards, not this will delete all comments, attachments for the card
            foreach (var card in board.Cards.ToList())
            {
                db.Cards.Remove(card);
            }

            // delete columns
            foreach (var column in board.Columns.ToList())
            {
                db.BoardColumns.Remove(column);
            }

            // delete board member
            foreach (var member in board.Members.ToList())
            {
                db.BoardMembers.Remove(member);
            }
            
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("delete");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("board", board.BoardId.ToString(), board.Name, String.Format(@"/board/{0}", board.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> deleted board <b>{2}</b>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectDisplayName
                ));
            activity = db.Activities.Add(activity);

            db.Boards.Remove(board);
            db.SaveChanges();

            return true;
        }
    }
}
