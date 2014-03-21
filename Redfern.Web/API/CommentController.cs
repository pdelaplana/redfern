using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    public class CommentController : ApiController
    {
        private IRedfernRepository _repository;

        public CommentController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/comment
        public IEnumerable<CardCommentModel> Get(int id)
        {
            Card card = _repository.Get<Card>(id);
            return AutoMapper.Mapper.Map<IList<CardComment>, IList<CardCommentModel>>(card.Comments.OrderByDescending(c => c.CommentDate).ToList());
        }

        
        // POST api/comment
        public CardCommentModel Post([FromBody]CreateCardCommentCommand command)
        {
            var cardComment = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CardComment, CardCommentModel>(cardComment);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/tag/
        public void Delete([FromBody]DeleteCardTagCommand command)
        {
            _repository.ExecuteCommand(command);
        }
    }
}