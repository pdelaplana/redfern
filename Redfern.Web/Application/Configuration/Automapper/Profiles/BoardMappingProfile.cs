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
            Mapper.CreateMap<Board, BoardListItem>();

            Mapper.CreateMap<BoardColumn, BoardColumnItem>()
                .ForMember(dest => dest.Cards, opts => opts.MapFrom(src => src.Cards.OrderBy(c => c.Sequence).ToList()));

            Mapper.CreateMap<BoardColumn, BoardColumnDTO>();

            Mapper.CreateMap<Board, BoardViewModel>()
                .ForMember(dest => dest.Columns, opts => opts.MapFrom(src => src.Columns.OrderBy(c=>c.Sequence).ToList()));

            Mapper.CreateMap<Card, CardItem>()
                .ForMember(dest => dest.CommentCount, opts => opts.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.Tags, opts => opts.MapFrom(src => src.Tags.Select(tag => tag.Tag.TagName).ToArray()));

            Mapper.CreateMap<CardComment, CardCommentModel>()
                .ForMember(dest => dest.CommentByUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src=>src.CommentByUser));

        }
        
    }
}