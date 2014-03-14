using System;
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
    public class CardController : ApiController
    {
        private IRedfernRepository _repository;

        public CardController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/card
        public CardItem Post([FromBody]CreateCardCommand command)
        {
            Card card = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<Card, CardItem>(card);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }

        [AcceptVerbs("resequence")]
        public void Resequence([FromBody]ResequenceCardsCommand command)
        {
            _repository.ExecuteCommand(command);
        }
    }
}