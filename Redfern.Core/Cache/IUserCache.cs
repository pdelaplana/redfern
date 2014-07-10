using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Redfern.Security;

namespace Redfern.Core.Cache
{
    public interface IUserCache<T> where T: IdentityUser
    {
        T Get(string userName);
        string GetFullName(string userName);
        IList<T> GetAll();
        void Init();
    }
}
