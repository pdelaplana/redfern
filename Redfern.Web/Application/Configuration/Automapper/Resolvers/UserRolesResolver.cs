using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using AutoMapper;
using Redfern.Core.Cache;
using Redfern.Security;

namespace Redfern.Web.Application.Configuration.Automapper.Resolvers
{
    public class UserRolesResolver : ValueResolver<string, string[]>
    {
        private RedfernUserManager _userManager = HttpContext.Current.GetOwinContext().GetUserManager<RedfernUserManager>();

       
        protected override string[] ResolveCore(string source)
        {
            return _userManager.GetRoles(source).ToArray();
        }
    }
}