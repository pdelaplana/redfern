using System.Web.Http;
using System.Web.Mvc;
using System.Web.Http;
using Microsoft.Practices.Unity;
using Unity.Mvc5;
using Livefrog.Commons.Services;
using Livefrog.Commons.Unity;
using Redfern.Core;
using Redfern.Core.Cache;
using Redfern.Core.Repository;
using Redfern.Core.Security;
using Redfern.Web.Application;
using Redfern.Web.Application.Cache;

namespace Redfern.Web
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            // e.g. container.RegisterType<ITestService, TestService>();
            container.RegisterType<ICacheService, WebCacheService>();

            container.RegisterType<IUserCache<RedfernUser>, UserCache>();

            container.RegisterType<IRedfernRepository, RedfernRepository>();

            // cache
            container.RegisterType<TenantsCache>();
            container.RegisterType<UserCache>();

            container.RegisterType<RedfernContext, RedfernWebContext>("", new PerRequestLifetimeManager());
            

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));


            // webapi
            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);
        }
    }
}