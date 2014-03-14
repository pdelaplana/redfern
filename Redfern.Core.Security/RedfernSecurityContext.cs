using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Threading.Tasks;

namespace Redfern.Core.Security
{
    public class RedfernSecurityContext : IdentityDbContext<RedfernUser>
    {

        public static UserManager<RedfernUser> CreateUserManager()
        {
            return new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
        }

        public IList<RedfernUser> GetUsers()
        {
            return this.Users.ToList();
        }

        public RedfernSecurityContext() : base("MembershipConnection")
        {
        }
    }
}
