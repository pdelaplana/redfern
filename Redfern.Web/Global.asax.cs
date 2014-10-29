using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Data.Entity;
using System.IdentityModel;
using System.IdentityModel.Tokens;
using System.IdentityModel.Security;
using System.IdentityModel.Services;
using System.IdentityModel.Services.Configuration;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Redfern.Core.Models;
using Redfern.Core.Migrations;
using Redfern.Web.Application;
using Redfern.Web.Application.Cache;

namespace Redfern.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<RedfernDb, Configuration>());
            //FederatedAuthentication.FederationConfigurationCreated += OnFederationConfigurationCreated;

            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            UnityConfig.RegisterComponents();
            AutoMapperConfig.RegisterMaps();

            // initialize user cache
            var userCache = DependencyResolver.Current.GetService<UserCache>();
            userCache.Init();

            // initialize tenant Cache
            var tenantCache = DependencyResolver.Current.GetService<TenantsCache>();
            tenantCache.Init();



           
        }

        
        /*
        void OnFederationConfigurationCreated(object sender, FederationConfigurationCreatedEventArgs e)
        {
            var sessionTransforms = new List<CookieTransform>(
             new CookieTransform[]
                {
                    new DeflateCookieTransform(),
                    new RsaEncryptionCookieTransform(e.FederationConfiguration.ServiceCertificate),
                    new RsaSignatureCookieTransform(e.FederationConfiguration.ServiceCertificate)
                });
            var sessionHandler = new SessionSecurityTokenHandler(sessionTransforms.AsReadOnly());

            e.FederationConfiguration
                .IdentityConfiguration
                .SecurityTokenHandlers
                .AddOrReplace(sessionHandler);
        }
         * */
    }
}
