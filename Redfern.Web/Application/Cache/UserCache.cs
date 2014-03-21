using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Livefrog.Commons.Services;
using Redfern.Core.Cache;
using Redfern.Core.Security;

namespace Redfern.Web.Application.Cache
{
    public class UserCache : IUserCache<RedfernUser>
    {
        private ICacheService _cacheService;
        private RedfernSecurityContext _securityContext;

        private IDictionary<string, RedfernUser> GetUsersDictionary()
        {
            var dictionary = _cacheService.Get<Dictionary<string, RedfernUser>>();
            if (dictionary == null)
            {
                Init();
                dictionary = _cacheService.Get<Dictionary<string, RedfernUser>>();
            }
            return dictionary;
        }

        public UserCache(ICacheService cacheService,
            RedfernSecurityContext securityContext)
        {
            this._cacheService = cacheService;
            this._securityContext  = securityContext;
        }

        public void Init()
        {
            IDictionary<string, RedfernUser> dictionary = new Dictionary<string, RedfernUser>();
            foreach (var user in this._securityContext.Users.ToList())
            {
                dictionary.Add(user.UserName, (RedfernUser)user);
            }

            this._cacheService.Add(dictionary);
        }

        public void Refresh()
        {
            this._cacheService.Remove<Dictionary<string, IAccountUser>>();
            Init();
        }

        public string GetFullName(string userName)
        {
            var user = this.Get(userName);
            return user != null ? user.FullName: "unknown";
        }

        public RedfernUser Get()
        {
            var userName = HttpContext.Current.User.Identity.Name;
            return Get(userName);
        }

        public RedfernUser Get(string userName)
        {
            RedfernUser user = null;
            var dictionary = GetUsersDictionary();
            if (dictionary.ContainsKey(userName))
                user = dictionary[userName];
            if (user == null)
            {
                user = this._securityContext.Users.Where(u => u.UserName == userName).SingleOrDefault();
                if (user != null)
                {
                    dictionary.Add(user.UserName, user);
                    return user;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return user;
            }
        }

        public void Update(string userName)
        {
            RedfernUser user = this._securityContext.Users.Where(u => u.UserName == userName).SingleOrDefault();
            if (user != null)
            {
                var dictionary = GetUsersDictionary();
                dictionary.Remove(user.UserName);
                dictionary.Add(user.UserName, user);
            }
        }

        public void Remove(string userName)
        {
            var dictionary = GetUsersDictionary();
            dictionary.Remove(userName);
            
        }

        public IList<RedfernUser> GetAll()
        {
            var dictionary = GetUsersDictionary();
            return dictionary.Values.ToList();        
        }

    }
}