﻿using System;
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
    public class UnarchiveCardCommand : IRepositoryCommand<Card>
    {

        public int CardId { get; set; }
        
        public CommandResult<Card> Execute(RedfernDb db)
        {
            Card card = db.Cards.Find(this.CardId);
            card.ArchivedDate = null;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("unarchived");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription("{actorlink} unarchived {objectlink} in {contextlink}.");
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<Card>(card, db, activity);

           
        }
    }
}
