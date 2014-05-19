using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;


namespace Redfern.Core.Security
{
    public class RedfernRoleManager : RoleManager<IdentityRole>
    {
        public RedfernRoleManager(RoleStore<IdentityRole> store):base(store)
        {
            
        }

        public static RedfernRoleManager Create(IdentityFactoryOptions<RedfernRoleManager> options, IOwinContext context)
        {
            //var roleManager = new RedfernRoleManager(new RoleStore<IdentityRole>(context.Get<RedfernSecurityContext>()));
            var roleManager = new RedfernRoleManager(new RoleStore<IdentityRole>(context.Get<RedfernSecurityContext>()));
            return roleManager;
        }

        public void SeedRoles()
        {
            //
            // Community Admin
            // - add new roles
            if (!this.RoleExists("ADMIN"))
                this.Create(new IdentityRole("ADMIN"));


            
        }
    }
}
