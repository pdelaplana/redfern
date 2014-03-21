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
    public class DeleteBoardColumnCommand : IRepositoryCommand<bool>
    {
        public int ColumnId { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            BoardColumn column = db.BoardColumns.Find(this.ColumnId);
            db.BoardColumns.Remove(column);
            db.SaveChanges();

            return true;
        }
    }
}
