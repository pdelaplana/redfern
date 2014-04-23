using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    public class CardActivityController : ApiController
    {
        private IRedfernRepository _repository;

        public CardActivityController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/cardactivity
        public IEnumerable<ActivityListItem> Get(int id)
        {
            var idAsString = id.ToString();
            var list = _repository.Activities.Where(a => a.ObjectType == "card" && a.ObjectId == idAsString).OrderByDescending(a => a.ActivityDate).ToList();
            return AutoMapper.Mapper.Map<IList<Activity>, IList<ActivityListItem>>(list);
        }


        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}