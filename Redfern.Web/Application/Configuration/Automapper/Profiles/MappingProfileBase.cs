using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using Unity;
using Microsoft.Practices.Unity;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class MappingProfileBase : Profile
    {
        protected IUnityContainer Container { get { return DependencyResolver.Current.GetService<IUnityContainer>(); } }

        public override string ProfileName
        {
            get
            {
                return this.GetType().Name;
            }
        }

        protected override void Configure()
        {

        }
    }
}