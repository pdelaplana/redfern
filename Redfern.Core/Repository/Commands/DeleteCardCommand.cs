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
    public class DeleteCardCommand : IRepositoryCommand<bool>
    {
        public int CardId { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Card card = db.Cards.Find(this.CardId);
            
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("delete");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription("<b>{actorlink}</b> deleted <b>{object}</b> from <b>{contextlink}</b>");
            activity = db.Activities.Add(activity);

            db.Cards.Remove(card);
            db.SaveChanges();

            return true;
        }
    }
}
