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
    public class CreateCardTagCommand : IRepositoryCommand<CardTag>
    {
        public int CardId { get; set; }
        public string TagName { get; set; }
        
        public CommandResult<CardTag> Execute(RedfernDb db)
        {
            Card card = db.Cards.Find(this.CardId);

            CardTag cardTag = db.CardTags.Where(ct => ct.CardId == this.CardId && ct.Tag.TagName == this.TagName).FirstOrDefault();

            if (cardTag == null)
            {
                Tag tag = db.Tags.Where(t => t.TagName == this.TagName && t.BoardId == card.BoardId).FirstOrDefault();
                if (tag == null)
                {
                    tag = db.Tags.Create();
                    tag.TagName = this.TagName;
                    tag.BoardId = card.BoardId;
                    tag = db.Tags.Add(tag);
                    db.SaveChanges();
                }

                cardTag = db.CardTags.Create();
                cardTag.CardId = this.CardId;
                cardTag.TagId = tag.TagId;
                cardTag = db.CardTags.Add(cardTag);
                db.SaveChanges();

                Activity activity = db.Activities.Create();
                activity.ActivityDate = DateTime.UtcNow;
                activity.SetVerb("added");
                activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
                activity.SetObject("tag", cardTag.CardTagId.ToString(), cardTag.Tag.TagName, String.Format(@"#/board/{0}/card/{1}", card.BoardId, card.CardId));
                activity.SetTarget("card", cardTag.CardId.ToString(), cardTag.Card.Title, "");
                activity.SetContext("board", cardTag.Card.BoardId.ToString(), cardTag.Card.Board.Name, String.Format(@"/board/{0}", cardTag.Card.BoardId));
                activity.SetDescription("{actorlink} added tag to {target} in {context}");
                activity = db.Activities.Add(activity);
                db.SaveChanges();

                return this.CommandResult<CardTag>(cardTag, db, activity);
            }
            else
            {
                return this.CommandResult<CardTag>(cardTag, db);
            }
            
        }
    }
}
