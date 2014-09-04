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
    public class ResequenceCardsCommand : IRepositoryCommand<Card>
    {
        public int CardId { get; set; }
        public int TargetColumnId { get; set; }
        public int[] CardIds { get; set; }

        public CommandResult<Card> Execute(RedfernDb db)
        {

            CommandResult<Card> result = null;
            
            // check if column is an archived column
            BoardColumn targetColumn = db.BoardColumns.Where(c => c.ColumnId == this.TargetColumnId).SingleOrDefault();
            
            int counter = 1;
            Card card = null;
            Activity activity = null;

            foreach (var id in this.CardIds)
            {
                card = db.Cards.Find(id);

                // is this the card being moved
                if (card.CardId == this.CardId)
                {
                    // yes, so we needt to create activity records for it
                    if (card.ColumnId != this.TargetColumnId)
                    {
                        if (targetColumn.Name == "Archived")
                        {
                            // we're archiving this cards
                            DateTime archivedDate = DateTime.UtcNow;
                            if (!card.ArchivedDate.HasValue)
                                    card.ArchivedDate = archivedDate;
                            activity = CreateArchiveCardActivity(card, db);
                            //result = this.CommandResult<Card>(card, db, activity);
                    
                        } 
                        else 
                        {
                            // not archiving... make sure archivedDate is null
                            card.ArchivedDate = null;
                            // and create a move activity
                            activity = CreateMoveCardActivity(card, db, targetColumn);
                            //result = this.CommandResult<Card>(card, db, activity);   
                        }
                     
                    }
                    else
                    {
                        // and create a move activity
                        activity = CreateMoveCardActivity(card, db);
                        //result = this.CommandResult<Card>(card, db, activity);   
                    }
                }

                card.ColumnId = this.TargetColumnId;
                card.Sequence = counter;
                
                counter++;
            }

            
            db.SaveChanges();


            return this.CommandResult<Card>(card, db, activity); ;
        }

        private Activity CreateMoveCardActivity(Card card, RedfernDb db, BoardColumn targetColumn = null)
        {
            // create an activity 
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("moved");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetSource("column", card.ColumnId.ToString(), card.Column.Name, "");
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            if (targetColumn != null)
            {
                activity.SetTarget("column", targetColumn.ColumnId.ToString(), targetColumn.Name, "");
                activity.SetDescription("{actor} moved card {object} from {source} to {target} in board {context}.");
            }
            else
            {
                activity.SetDescription("{actorlink} moved card {object} in board {context}.");
            }
                
            
            activity = db.Activities.Add(activity);
            return activity;
        }

        private Activity CreateArchiveCardActivity(Card card, RedfernDb db)
        {
            // create an activity 
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("archived");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription("{actor} arvived card {object} in board {context}.");
            activity = db.Activities.Add(activity);
            return activity;
        }
    }
}
