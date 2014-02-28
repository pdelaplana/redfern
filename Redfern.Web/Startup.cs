using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Redfern.Web.Startup))]
namespace Redfern.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
