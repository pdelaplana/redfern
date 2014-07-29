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
    public class ChangeCardColorCommand : IRepositoryCommand<Card>
    {
        public int CardId { get; set; }
        public string Color { get; set; }

        public CommandResult<Card> Execute(RedfernDb db)
        {
            
            Card card = db.Cards.Find(this.CardId);
            CardType cardType = card.Board.CardTypes.Where(ct => ct.ColorCode == this.Color).SingleOrDefault();
            card.CardTypeId = cardType.CardTypeId;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("changed");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetTarget("color", cardType.ColorCode, cardType.ColorCode, "");
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription("{actorlink} changed card {objectlink} to {target} in {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<Card>(card, db, activity);
            
        }
    }
}
