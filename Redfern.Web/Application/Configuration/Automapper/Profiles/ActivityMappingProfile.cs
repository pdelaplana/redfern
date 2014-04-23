using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Models;
using Redfern.Web.Models;
using Redfern.Web.Application.Configuration.Automapper.Resolvers;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class ActivityMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            Mapper.CreateMap<Activity, ActivityListItem>();            

        }
        
    }
}