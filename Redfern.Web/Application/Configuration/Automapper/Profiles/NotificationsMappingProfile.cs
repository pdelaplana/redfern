using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Web.API;
using Redfern.Web.API.DTO;
using Redfern.Web.Models;
using Redfern.Web.Application.Configuration.Automapper.Resolvers;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class NotificationsMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            
            Mapper.CreateMap<Notification, NotificationViewModel>()
                .ForMember(dest => dest.RecipientUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.RecipientUser))
                .ForMember(dest => dest.SenderUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.SenderUser));

            
        }
        
    }
}