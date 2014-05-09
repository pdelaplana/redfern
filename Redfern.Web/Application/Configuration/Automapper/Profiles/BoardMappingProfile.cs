using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Models;
using Redfern.Web.API.DTO;
using Redfern.Web.Models;
using Redfern.Web.Application.Configuration.Automapper.Resolvers;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class BoardMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            Mapper.CreateMap<Board, BoardMenuItem>();

            Mapper.CreateMap<Board, BoardListItem>()
                //.ForMember(dest => dest.OwnerFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src=> src.Owner))
                .ForMember(dest => dest.CardCount, opts => opts.MapFrom(src => src.Cards.Count(c=>!c.ArchivedDate.HasValue)));

            Mapper.CreateMap<BoardColumn, BoardColumnItem>()
                .ForMember(dest => dest.Cards, opts => opts.MapFrom(src => src.Cards.OrderBy(c => c.Sequence).ToList()));

            Mapper.CreateMap<BoardColumn, BoardColumnDTO>();

            Mapper.CreateMap<Board, BoardViewModel>()
                .ForMember(dest => dest.OwnerFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.Owner))
                .ForMember(dest => dest.Columns, opts => opts.MapFrom(src => src.Columns.OrderBy(c=>c.Sequence).ToList()));

            Mapper.CreateMap<BoardMember, BoardMemberItem>()
                .ForMember(dest => dest.FullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.UserName));

            

        }
        
    }
}