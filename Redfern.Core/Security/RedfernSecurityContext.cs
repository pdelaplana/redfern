using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Redfern.Core.Security
{
    public class RedfernSecurityContext : IdentityDbContext<RedfernUser>
    {

        public static UserManager<RedfernUser> CreateUserManager()
        {
            return new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
        }

        public RedfernSecurityContext() : base("MembershipConnection")
        {
        }
    }
}
