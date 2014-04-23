﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;

namespace Redfern.Web.API
{
    [Authorize]
    public class CardTypeController : ApiController
    {

        private IRedfernRepository _repository;

        public CardTypeController(IRedfernRepository repository)
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

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/cardtype/5
        public void Put(int id, [FromBody]UpdateCardTypeCommand command)
        {
            _repository.ExecuteCommand(command);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}