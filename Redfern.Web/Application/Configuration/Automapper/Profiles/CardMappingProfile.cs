﻿using System;
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
    public class CardMappingProfile : MappingProfileBase
    {
        protected override void Configure()
        {
            
            Mapper.CreateMap<CardType, CardTypeItem>()
                .ForMember(dest => dest.Color, opts => opts.MapFrom(src => src.ColorCode));

            Mapper.CreateMap<Card, CardItem>()
                .ForMember(dest => dest.AssignedToUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.AssignedToUser))
                .ForMember(dest => dest.CommentCount, opts => opts.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.AttachmentCount, opts => opts.MapFrom(src => src.Attachments.Count))
                .ForMember(dest => dest.Color, opts => opts.MapFrom(src => src.CardType.ColorCode))
                .ForMember(dest => dest.IsArchived, opts => opts.MapFrom(src => src.ArchivedDate.HasValue))
                .ForMember(dest => dest.Tags, opts => opts.MapFrom(src => src.Tags.Select(tag => tag.Tag.TagName).ToArray()));

            Mapper.CreateMap<CardComment, CardCommentModel>()
                .ForMember(dest => dest.CommentByUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src=>src.CommentByUser));

            Mapper.CreateMap<CardAttachment, CardAttachmentListItem>()
                .ForMember(dest => dest.UploadDate, opts => opts.MapFrom(src => src.CreatedDate))
                .ForMember(dest => dest.UploadByUserFullName, opts => opts.ResolveUsing<CacheUserFullNameResolver>().FromMember(src => src.CreatedByUser));
        }
        
    }
}