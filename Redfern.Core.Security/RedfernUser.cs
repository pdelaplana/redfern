using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Redfern.Core.Security
{
    public class RedfernUser: IdentityUser
    {
        [MaxLength(50)]
        public string FullName { get; set; }

        /*
        [MaxLength(100)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        */
        
        public byte[] Avatar { get; set; }

        [MaxLength(20)]
        public string AvatarContentType { get; set; }

    }
}
