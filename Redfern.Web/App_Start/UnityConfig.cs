using System.Web.Http;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Practices.Unity;
using Unity.Mvc5;
using Livefrog.Commons.Services;
using Livefrog.Commons.Unity;
using Redfern.Core;
using Redfern.Core.Cache;
using Redfern.Core.Repository;
using Redfern.Security;
using Redfern.Web.Application;
using Redfern.Web.Application.Cache;
using Redfern.Web.Hubs;

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

            // context
            container.RegisterType<RedfernContext, RedfernWebContext>("", new PerRequestLifetimeManager());

            // TODO: revisit DI in signalr hubs.  
            // signalr  
            //container.RegisterType<NotificationsHub, NotificationsHub>(new ContainerControlledLifetimeManager());
            //container.RegisterType<IHubActivator, UnityHubActivator>(new ContainerControlledLifetimeManager());
            //GlobalHost.DependencyResolver.Register(typeof(IHubActivator), () => new UnityHubActivator(container));


            DependencyResolver.SetResolver(new UnityDependencyResolver(container));


            // webapi
            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);

            
            
        }
    }
}