using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Security;
using Redfern.Web.Models;
using Redfern.Web.Application.Configuration.Automapper.Resolvers;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class UserProfileMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            Mapper.CreateMap<RedfernUser, ProfileViewModel>();

            Mapper.CreateMap<RedfernUser, UserListItem>()
                .ForMember(dest => dest.Roles, opts => opts.ResolveUsing<UserRolesResolver>().FromMember(src => src.Id))
                .ForMember(dest => dest.IsLockedOut, opts => opts.MapFrom(src => src.LockoutEndDateUtc.HasValue ? (src.LockoutEndDateUtc > DateTime.UtcNow) : false))
                .ForMember(dest => dest.NumberOfBoardsOwned, opts => opts.ResolveUsing<NumberOfBoardsOwnedResolver>().FromMember(src => src.UserName));            

        }
        
    }
}