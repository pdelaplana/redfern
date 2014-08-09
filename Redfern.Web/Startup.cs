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
            // Make long polling connections wait a maximum of 110 seconds for a
            // response. When that time expires, trigger a timeout command and
            // make the client reconnect.
            GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(110);

            // Wait a maximum of 30 seconds after a transport connection is lost
            // before raising the Disconnected event to terminate the SignalR connection.
            GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(30);

            // For transports other than long polling, send a keepalive packet every
            // 10 seconds. 
            // This value must be no more than 1/3 of the DisconnectTimeout value.
            GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(10);

            app.MapSignalR();
            ConfigureAuth(app);

            // ensure that Json propertynames are in camelcase emiited by signalr hubs 
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => JsonSerializerFactory.Value); 

        }

        // camelcase Json propertynames emited by signalr hubs 
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
