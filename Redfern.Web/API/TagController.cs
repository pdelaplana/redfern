using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;


namespace Redfern.Web.API
{
    [Authorize]
    public class TagController : ApiController
    {
        private IRedfernRepository _repository;

        public TagController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/tag
        public IDictionary<string, string> Get(string name)
        {
            if (String.IsNullOrEmpty(name))
                return _repository.Tags.ToDictionary(key => key.TagId.ToString(), value => value.TagName);
            else
                return _repository.Tags.Where(t => t.TagName.Contains(name)).ToDictionary(key => key.TagId.ToString(), value => value.TagName);
        }

        

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/tag
        public void Post([FromBody]CreateCardTagCommand command)
        {
            _repository.ExecuteCommand(command);
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