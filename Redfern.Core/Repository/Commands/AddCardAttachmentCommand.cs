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
    public class AddCardAttachmentCommand : IRepositoryCommand<CardAttachment>
    {

        public int CardId { get; set; }
        public byte[] FileContent { get; set; }
        public string ContentType { get; set; }
        public string FileName {get; set; }
        public string FileExtension { get; set; }


        public CommandResult<CardAttachment> Execute(RedfernDb db)
        {
            CardAttachment attachment = db.CardAttachments.Create();
            attachment.CardId = this.CardId;
            attachment.FileName = this.FileName;
            attachment.FileExtension = this.FileExtension;
            attachment.ContentType = this.ContentType;
            attachment.FileContent = this.FileContent;
            attachment = db.CardAttachments.Add(attachment);
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("attached");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("attachment", attachment.CardAttachmentId.ToString(), attachment.FileName, String.Format(@"/api/attachment/{0}", attachment.CardAttachmentId.ToString()));
            activity.SetTarget("card", attachment.CardId.ToString(), attachment.Card.Title, String.Format(@"/board/{0}/card/{1}", attachment.Card.BoardId.ToString(), attachment.CardId.ToString()));
            activity.SetContext("board", attachment.Card.BoardId.ToString(), attachment.Card.Board.Name, String.Format(@"/board/{0}", attachment.Card.BoardId));
            activity.SetDescription("{actorlink} attached file {objectlink} to card {targetlink} in {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<CardAttachment>(attachment, db, activity);

        }
    }
}
