using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Security;

namespace Redfern.Core.Repository.Commands
{
    public class CreateCardCommand : IRepositoryCommand<Card>
    {

        public int BoardId { get; set; }
        public int ColumnId { get; set; }
        public string Title { get; set; }
        public int Sequence { get; set; }

        public Card Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Board board = db.Boards.Find(this.BoardId);

            Card card = db.Cards.Create();
            card.BoardId = this.BoardId;
            card.ColumnId = this.ColumnId;
            card.Title= this.Title;
            card.Sequence = this.Sequence;
            card.CardTypeId = board.CardTypes.Where(ct => ct.ColorCode == "amber").SingleOrDefault().CardTypeId;
            card = db.Cards.Add(card);
            
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("create");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> hanged new card <a href=""{2}"">{3}</a> in board <a href=""{4}"">{5}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName,
                    activity.ContextUrl,
                    activity.ContextDisplayName
                ));
            activity = db.Activities.Add(activity);
            db.SaveChanges();


            return card;
        }
    }
}
