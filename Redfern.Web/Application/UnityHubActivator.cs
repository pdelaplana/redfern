using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Practices.Unity;

namespace Redfern.Web.Application
{
    public class UnityHubActivator : IHubActivator
    {
        private readonly IUnityContainer container;

        public UnityHubActivator(IUnityContainer container)
        {
            this.container = container;
        }

        public IHub Create(HubDescriptor descriptor)
        {
            return (IHub)container.Resolve(descriptor.HubType);
        }
    }
}