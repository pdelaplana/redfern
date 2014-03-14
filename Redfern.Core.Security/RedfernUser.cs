using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Redfern.Core.Security
{
    public class RedfernUser: IdentityUser
    {
        [MaxLength(50)]
        public string FullName { get; set; }
    }
}
