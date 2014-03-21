using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Security;
using Redfern.Web.Models;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class UserProfileMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            Mapper.CreateMap<RedfernUser, ProfileViewModel>();            
        }
        
    }
}