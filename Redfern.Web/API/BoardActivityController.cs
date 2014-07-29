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
    [RoutePrefix("api/board/{boardid:int}/activity")]
    [Authorize]
    public class BoardActivityController : ApiController
    {
        private IRedfernRepository _repository;

        public BoardActivityController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        [Route("")]
        public IList<ActivityListItem> Get(int boardId)
        {
            var idAsString = boardId.ToString();
            return AutoMapper.Mapper.Map<IList<Activity>, IList<ActivityListItem>>(_repository.Activities.OfBoard(boardId).OrderByDescending(a => a.ActivityDate).Take(20).ToList()); 
        }
    }
}
