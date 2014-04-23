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
    public class ResequenceCardsCommand : IRepositoryCommand<bool>
    {
        public int ColumnId { get; set; }
        public int[] CardIds { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            IList<Card> movedCards = new List<Card>();

            // check if column is an archived column
            BoardColumn targetColumn = db.BoardColumns.Where(c => c.ColumnId == this.ColumnId ).SingleOrDefault();
            
            int counter = 1;
            Card card;
            foreach (var id in this.CardIds)
            {
                card = db.Cards.Find(id);
                if (card.ColumnId != this.ColumnId)
                {
                    CreateMoveCardActivity(card, targetColumn, db, userCache);
                }
                card.ColumnId = this.ColumnId;
                card.Sequence = counter;
                if (targetColumn.Name == "Archived")
                {
                    // we're archiving these cards
                    DateTime archivedDate = DateTime.UtcNow;
                    if (!card.ArchivedDate.HasValue)
                        card.ArchivedDate = archivedDate;
                }
                else
                {
                    // not archiving, so ensure that the archived date is clear for each card
                    card.ArchivedDate = null;
                }
                counter++;
            }
            db.SaveChanges();

            return true;
        }

        private void CreateMoveCardActivity(Card card, BoardColumn targetColumn, RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            // create an activity 
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("moved");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetSource("column", card.ColumnId.ToString(), card.Column.Name, "");
            activity.SetTarget("column", targetColumn.ColumnId.ToString(), targetColumn.Name, "");
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription("{actor} moved card {object} from {source} to {target} in board {context}.");
            activity = db.Activities.Add(activity);
        }
    }
}
