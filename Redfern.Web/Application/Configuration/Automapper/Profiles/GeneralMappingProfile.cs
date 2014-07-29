using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Repository;
using Redfern.Web.API;
using Redfern.Web.Application;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class GeneralMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            Mapper.CreateMap<RedfernAccessType, string>().ConvertUsing(src => src.ToString());

            Mapper.CreateMap<Redfern.Core.Repository.ActivityContext, Redfern.Web.API.ActivityContext>();

            Mapper.CreateMap<Redfern.Core.Repository.CommandContext, Redfern.Web.API.CommandContext>();

            Mapper.CreateMap<CommandResult<bool>, WebApiResult<bool>>();

            Mapper.CreateMap<CommandResult<string>, WebApiResult<string>>();
        }
        
    }
}