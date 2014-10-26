using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Redfern.Security;

namespace Redfern.Web.Application
{
    public class RedfernSignInManager : SignInManager<RedfernUser, string>
    {
        public RedfernSignInManager(RedfernUserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(RedfernUser user)
        {
            return user.GenerateUserIdentityAsync((RedfernUserManager)UserManager);
        }

        public static RedfernSignInManager Create(IdentityFactoryOptions<RedfernSignInManager> options, IOwinContext context)
        {
            return new RedfernSignInManager(context.GetUserManager<RedfernUserManager>(), context.Authentication);
        }

        public override Task<SignInStatus> PasswordSignInAsync(string userName, string password, bool isPersistent, bool shouldLockout)
        {
            return base.PasswordSignInAsync(userName, password, isPersistent, shouldLockout);
        }

    }
}