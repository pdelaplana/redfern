using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Cache;
using Redfern.Core.Security;

namespace Redfern.Web.Application.Configuration.Automapper.Resolvers
{
    public class CacheUserFullNameResolver : ValueResolver<string, string>
    {
        private IUserCache<RedfernUser> _cache;

        public CacheUserFullNameResolver(IUserCache<RedfernUser>  cache)
        {
            _cache = cache;
        }

        protected override string ResolveCore(string source)
        {
            if (!String.IsNullOrEmpty(source))
                return _cache.GetFullName(source);
            else
                return "Unknown User";
        }
    }
}