using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Web.Application;
using Redfern.Web.Application.Configuration.Automapper.Resolvers;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class GeneralMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            Mapper.CreateMap<RedfernAccessType, string>().ConvertUsing(src => src.ToString());
        }
        
    }
}