﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    [RoutePrefix("api/board/{boardid:int}/card/{cardid:int}/comments")]
    [Authorize]
    public class CardCommentController : ApiController
    {
        private IRedfernRepository _repository;

        public CardCommentController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/board/1/card/2/comments
        [Route("")]
        public IEnumerable<CardCommentViewModel> Get(int cardid)
        {
            Card card = _repository.Get<Card>(cardid);
            return AutoMapper.Mapper.Map<IList<CardComment>, IList<CardCommentViewModel>>(card.Comments.OrderByDescending(c => c.CommentDate).ToList());
        }

        
        // POST api/board/1/card/1/comments
        [Route("")]
        public WebApiResult<CardCommentViewModel> Post([FromBody]AddCardCommentCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<CardComment>, WebApiResult<CardCommentViewModel>>(result);
        }

        // PUT api/board/5/card/1/comments/1
        [Route("{id:int}")]
        public WebApiResult<CardCommentViewModel> Put(int id, [FromBody]UpdateCardCommentCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<CardComment>, WebApiResult<CardCommentViewModel>>(result);
        }

        // DELETE api/board/1/card/1/comments/5
        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteCardCommentCommand { CardCommentId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }
    }
}