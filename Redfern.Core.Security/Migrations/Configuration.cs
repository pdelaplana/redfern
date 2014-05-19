namespace Redfern.Core.Security.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.Threading.Tasks;


    internal sealed class Configuration : DbMigrationsConfiguration<Redfern.Core.Security.RedfernSecurityContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected async override void Seed(Redfern.Core.Security.RedfernSecurityContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            await SeedAdministratorRolesAndUser();
           

        }

        public async Task<bool> SeedAdministratorRolesAndUser()
        {
            var roleManager = new RedfernRoleManager(new Microsoft.AspNet.Identity.EntityFramework.RoleStore<Microsoft.AspNet.Identity.EntityFramework.IdentityRole>(new RedfernSecurityContext()));
            roleManager.SeedRoles();

            var exists = await roleManager.RoleExistsAsync("ADMIN");
            if (!exists)
                await roleManager.CreateAsync(new Microsoft.AspNet.Identity.EntityFramework.IdentityRole("ADMIN"));

            // create an administrator user with a default password
            var userManager = new RedfernUserManager(new Microsoft.AspNet.Identity.EntityFramework.UserStore<RedfernUser>(new RedfernSecurityContext()));
            var user  = await userManager.FindByNameAsync("Administrator");
            if (user == null){
                user = new RedfernUser
                {
                    UserName = "administrator",
                    FullName = "Administrator",
                    Email = "administrator@mail.com",
                    IsEnabled = true,
                    SignupDate = DateTime.UtcNow,
                    TenantId = 1
                };
                await userManager.CreateAsync(user, "Password1");
                await userManager.AddToRoleAsync(user.Id, "ADMIN");
            }

            return true;


        }
    }
}
