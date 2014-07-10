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
    public class DeleteCardTagCommand : IRepositoryCommand<bool>
    {
        public int CardId { get; set; }
        public string TagName { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            CardTag cardTag = db.CardTags.Where(ct => ct.CardId == this.CardId && ct.Tag.TagName == this.TagName).SingleOrDefault();

            if (cardTag != null)
            {
                db.CardTags.Remove(cardTag);
                db.SaveChanges();
            }
            
            return true;
        }
    }
}
