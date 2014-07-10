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
    public class DeleteCardAttachmentCommand : IRepositoryCommand<bool>
    {
        public int CardAttachmentId { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            CardAttachment attachment = db.CardAttachments.Find(this.CardAttachmentId);
            
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("deleted");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("attachment", attachment.CardAttachmentId.ToString(), "", "");
            activity.SetSource("card", attachment.CardId.ToString(), attachment.Card.Title, "");
            activity.SetContext("board", attachment.Card.BoardId.ToString(), attachment.Card.Board.Name, String.Format(@"/board/{0}", attachment.Card.BoardId));
            activity.SetDescription("<b>{actorlink}</b> deleted <b>{object}</b> from {sourcelink} in {contextlink}");
            activity = db.Activities.Add(activity);

            db.CardAttachments.Remove(attachment);
            db.SaveChanges();

            return true;
        }
    }
}
