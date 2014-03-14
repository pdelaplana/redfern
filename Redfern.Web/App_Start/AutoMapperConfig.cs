using System;
using System.Collections.Generic;
using System.Reflection;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using Unity.Mvc5;
using Microsoft.Practices.Unity;

namespace Redfern.Web
{
    public static class AutoMapperConfig
    {
        public static void RegisterMaps()
        {
            IUnityContainer container = DependencyResolver.Current.GetService<IUnityContainer>();
            Mapper.Reset();
            Mapper.Initialize(x =>
            {
                x.ConstructServicesUsing(type => container.Resolve(type));

                var profileType = typeof(Profile);
                // Get an instance of each Profile in the executing assembly.
                var profiles = Assembly.GetExecutingAssembly().GetTypes()
                                .Where(t => profileType.IsAssignableFrom(t)
                                    && t.GetConstructor(Type.EmptyTypes) != null)
                                .Select(Activator.CreateInstance)
                                .Cast<Profile>();

                foreach (Profile profile in profiles)
                {
                    x.AddProfile(profile);
                }

            });
        }
    }
}
