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
    public class ResequenceBoardColumnsCommand : IRepositoryCommand<bool>
    {

        public int BoardId { get; set; }
        public int[] ColumnIds { get; set; }


        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            int counter = 1;
            BoardColumn column;
            foreach (var id in ColumnIds)
            {
                column = db.BoardColumns.Find(id);
                column.Sequence = counter;
                counter++;
            }
            db.SaveChanges();

            return true;
        }
    }
}
