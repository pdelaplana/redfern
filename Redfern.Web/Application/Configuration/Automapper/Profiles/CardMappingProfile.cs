using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Web.API;
using Redfern.Web.Models;
using Redfern.Web.Application.Configuration.Automapper.Resolvers;

namespace Redfern.Web.Application.Configuration.Automapper.Profiles
{
    public class CardMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {

            Mapper.CreateMap<CommandResult<Card>, WebApiResult<CardItem>>();
            Mapper.CreateMap<CommandResult<CardTag>, WebApiResult<CardTagItem>>();
            Mapper.CreateMap<CommandResult<CardComment>, WebApiResult<CardCommentViewModel>>();
            Mapper.CreateMap<CommandResult<CardTask>, WebApiResult<CardTaskViewModel>>();
            Mapper.CreateMap<CommandResult<CardAttachment>, WebApiResult<CardAttachmentListItem>>();
            Mapper.CreateMap<CommandResult<CardType>, WebApiResult<CardTypeItem>>();

            Mapper.CreateMap<CardType, CardTypeItem>()
                .ForMember(dest => dest.Color, opts => opts.MapFrom(src => src.ColorCode));

            Mapper.CreateMap<Card, CardItem>()
                .ForMember(dest => dest.CreatedByUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.CreatedByUser))
                .ForMember(dest => dest.AssignedToUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.AssignedToUser))
                .ForMember(dest => dest.CommentCount, opts => opts.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.AttachmentCount, opts => opts.MapFrom(src => src.Attachments.Count))
                .ForMember(dest => dest.CompletedTaskCount, opts => opts.MapFrom(src => src.Tasks.Where(t=>t.CompletedDate.HasValue).Count()))
                .ForMember(dest => dest.TotalTaskCount, opts => opts.MapFrom(src => src.Tasks.Count))
                .ForMember(dest => dest.CardLabel, opts => opts.MapFrom(src => src.CardType.Name))
                .ForMember(dest => dest.Color, opts => opts.MapFrom(src => src.CardType.ColorCode))
                .ForMember(dest => dest.IsArchived, opts => opts.MapFrom(src => src.ArchivedDate.HasValue))
                .ForMember(dest => dest.Tags, opts => opts.MapFrom(src => src.Tags.Select(tag => tag.Tag.TagName).ToArray()));

            Mapper.CreateMap<CardTag, CardTagItem>()
                .ForMember(dest => dest.BoardId, opts => opts.MapFrom(src => src.Card.BoardId))
                .ForMember(dest => dest.TagName, opts => opts.MapFrom(src => src.Tag.TagName));

            Mapper.CreateMap<CardComment, CardCommentViewModel>()
                .ForMember(dest => dest.BoardId, opts => opts.MapFrom(src => src.Card.BoardId))
                .ForMember(dest => dest.CommentByUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src=>src.CommentByUser));

            Mapper.CreateMap<CardTask, CardTaskViewModel>()
                .ForMember(dest => dest.AssignedToUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src=>src.AssignedToUser));

            Mapper.CreateMap<CardAttachment, CardAttachmentListItem>()
                .ForMember(dest => dest.UploadDate, opts => opts.MapFrom(src => src.CreatedDate))
                .ForMember(dest => dest.UploadByUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.CreatedByUser));
        }
        
    }
}