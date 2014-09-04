using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class UpdateBoardAccessedDateCommand : IRepositoryCommand<bool>
    {
        
        public int BoardId { get; set; }
        public string UserName { get; set; }

        public CommandResult<bool> Execute(RedfernDb db)
        {
            BoardMember member = db.BoardMembers.Where(m => m.BoardId == this.BoardId && m.UserName == this.UserName).SingleOrDefault();
            if (member != null)
            {
                member.LastAccessedDate = DateTime.UtcNow;
            }
            db.SaveChanges();

            return this.CommandResult<bool>(true, db, activityDate: DateTime.UtcNow, actorId: db.Context.ClientUserName, description: "LastAccessedDate was updated");

            
        }

        
    }
}
