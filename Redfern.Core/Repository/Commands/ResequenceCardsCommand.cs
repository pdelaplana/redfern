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
    public class ResequenceCardsCommand : IRepositoryCommand<bool>
    {
        public int ColumnId { get; set; }
        public int[] CardIds { get; set; }


        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            int counter = 1;
            Card card;
            foreach (var id in this.CardIds)
            {
                card = db.Cards.Find(id);
                card.ColumnId = this.ColumnId;
                card.Sequence = counter;
                counter++;
            }
            db.SaveChanges();
            return true;
        }
    }
}
