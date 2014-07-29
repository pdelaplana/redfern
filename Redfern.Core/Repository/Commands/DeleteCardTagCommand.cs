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
    public class DeleteCardTagCommand : IRepositoryCommand<string>
    {
        public int CardId { get; set; }
        public string TagName { get; set; }

        public CommandResult<string> Execute(RedfernDb db)
        {
            Activity activity = null;
            CardTag cardTag = db.CardTags.Where(ct => ct.CardId == this.CardId && ct.Tag.TagName == this.TagName).First();

            if (cardTag != null)
            {
                
                activity = db.Activities.Create();
                activity.ActivityDate = DateTime.UtcNow;
                activity.SetVerb("removed");
                activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
                activity.SetObject("tag", cardTag.CardTagId.ToString(), cardTag.Tag.TagName, String.Format(@"#/board/{0}/card/{1}", cardTag.Card.BoardId, cardTag.CardId));
                activity.SetSource("card", cardTag.CardId.ToString(), cardTag.Card.Title, "");
                activity.SetContext("board", cardTag.Card.BoardId.ToString(), cardTag.Card.Board.Name, String.Format(@"/board/{0}", cardTag.Card.BoardId));
                activity.SetDescription("{actorlink} removed tag from {source} in {context}");
                activity = db.Activities.Add(activity);

                db.CardTags.Remove(cardTag);
                db.SaveChanges();

            }

            return this.CommandResult<string>(this.TagName, db, activity);
        }
    }
}
