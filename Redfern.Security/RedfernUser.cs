using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;


namespace Redfern.Security
{
    public class RedfernUser: IdentityUser
    {
        [MaxLength(50)]
        public string FullName { get; set; }

        public int TenantId { get; set; }

        public DateTime SignupDate { get; set; }

        public DateTime? LastSignInDate { get; set; }

        public bool IsEnabled { get; set; }

        public byte[] Avatar { get; set; }

        [MaxLength(20)]
        public string AvatarContentType { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<RedfernUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }

    }
}
