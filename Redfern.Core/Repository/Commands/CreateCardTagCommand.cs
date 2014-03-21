using System;
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
    public class CreateCardTagCommand : IRepositoryCommand<CardTag>
    {
        public int CardId { get; set; }
        public string TagName { get; set; }
        

        public CardTag Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            CardTag cardTag = db.CardTags.Where(ct => ct.CardId == this.CardId && ct.Tag.TagName == this.TagName).SingleOrDefault();

            if (cardTag != null) return cardTag;

            Tag tag = db.Tags.Where(t=>t.TagName == this.TagName).SingleOrDefault();
            if (tag == null)
            {
                tag = db.Tags.Create();
                tag.TagName = this.TagName;
                tag = db.Tags.Add(tag);
                db.SaveChanges();
            }
                
            cardTag = db.CardTags.Create();
            cardTag.CardId = this.CardId;
            cardTag.TagId = tag.TagId;
            cardTag = db.CardTags.Add(cardTag);
            db.SaveChanges();

            return cardTag;
        }
    }
}
