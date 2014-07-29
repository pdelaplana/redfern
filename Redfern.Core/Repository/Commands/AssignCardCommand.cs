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
    public class AssignCardCommand : IRepositoryCommand<Card>
    {

        public int CardId { get; set; }
        public string AssignedToUser { get; set; }

        public CommandResult<Card> Execute(RedfernDb db)
        {
            Card card = db.Cards.Find(this.CardId);
            card.AssignedToUser = this.AssignedToUser;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            if (!String.IsNullOrEmpty(card.AssignedToUser))
            {
                if (card.AssignedToUser == db.Context.ClientUserName)
                {
                    activity.SetVerb("claimed");
                    activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
                    activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
                    activity.SetDescription("{actorlink} claimed card {objectlink} in {contextlink}");
                }
                else 
                {
                    activity.SetVerb("assigned");
                    activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
                    activity.SetTarget("member", card.AssignedToUser.ToString(), db.GetUserFullName(card.AssignedToUser), String.Format(@"/profile/{0}", card.AssignedToUser));
                    activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
                    activity.SetDescription("{actorlink} assigned card {objectlink} to {target} in {contextlink}");
                }
                
            }
            else
            {
                activity.SetVerb("unassigned");
                activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
                activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
                activity.SetDescription("{actorlink} unassigned card {objectlink} in {contextlink}");
            }
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<Card>(card, db, activity);
            
        }
    }
}
