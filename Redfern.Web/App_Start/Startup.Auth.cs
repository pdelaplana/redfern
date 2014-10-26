using System;
using System.Configuration;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using Redfern.Web.Application;

namespace Redfern.Web
{
    public partial class Startup
    {

        private static bool IsAjaxRequest(IOwinRequest request)
        {
            IReadableStringCollection query = request.Query;
            if ((query != null) && (query["X-Requested-With"] == "XMLHttpRequest"))
            {
                return true;
            }
            IHeaderDictionary headers = request.Headers;
            return ((headers != null) && (headers["X-Requested-With"] == "XMLHttpRequest"));
        }


        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            app.CreatePerOwinContext(Redfern.Security.RedfernSecurityContext.Create);
            app.CreatePerOwinContext<Redfern.Security.RedfernUserManager>(Redfern.Security.RedfernUserManager.Create);
            app.CreatePerOwinContext<Redfern.Web.Application.RedfernSignInManager>(Redfern.Web.Application.RedfernSignInManager.Create);
            app.CreatePerOwinContext<Redfern.Security.RedfernRoleManager>(Redfern.Security.RedfernRoleManager.Create);


            int timeOut = 15;
            Int32.TryParse(ConfigurationManager.AppSettings["AuthenticationTimeout"], out timeOut);
            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/account/signin"),
                ExpireTimeSpan = TimeSpan.FromMinutes(timeOut),
                SlidingExpiration= true,
                Provider = new CookieAuthenticationProvider
                {
                    OnApplyRedirect = ctx =>
                    {
                        if (!IsAjaxRequest(ctx.Request))
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                    }
                }
            });
            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            //app.UseFacebookAuthentication(
            //   appId: "",
            //   appSecret: "");

            //app.UseGoogleAuthentication();
        }
    }
}