using System;
using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Redfern.Web.Application.Configuration;

[assembly: OwinStartupAttribute(typeof(Redfern.Web.Startup))]
namespace Redfern.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            ConfigureAuth(app);

            // ensure that Json propertynames are in camelcase emiited by signalr hubs 
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => JsonSerializerFactory.Value); 

        }

        // camelcase Json propertynames emiited by signalr hubs 
        //
        private static readonly Lazy<JsonSerializer> JsonSerializerFactory = new Lazy<JsonSerializer>(GetJsonSerializer);
        private static JsonSerializer GetJsonSerializer()
        {
            return new JsonSerializer
            {
                ContractResolver = new FilteredCamelCasePropertyNamesContractResolver
                {
                    // 1) Register all types in specified assemblies: 
                    AssembliesToInclude = 
                    { 
                        typeof (Startup).Assembly 
                    },

                    // 2) Register individual types: 
                    //TypesToInclude = 
                    //                { 
                    //                    typeof(Hubs.BoardHub), 
                    //                } 
                }
            };
        } 
    }
}
