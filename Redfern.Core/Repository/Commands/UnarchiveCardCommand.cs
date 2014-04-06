﻿using System;
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
    public class UnarchiveCardCommand : IRepositoryCommand<Card>
    {

        public int CardId { get; set; }
        

        public Card Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Card card = db.Cards.Find(this.CardId);
            card.ArchivedDate = null;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("unarchived");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> unarchived card <a href=""{2}"">{3}</a> in board <a href=""{4}"">{5}</a>.",
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