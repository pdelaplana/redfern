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
    [RoutePrefix("api/board/{boardid:int}/card/{cardid:int}/tasks")]
    [Authorize]
    public class CardTaskController : ApiController
    {
        private IRedfernRepository _repository;

        public CardTaskController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/board/1/card/2/tasks
        [Route("")]
        public IEnumerable<CardTaskViewModel> Get(int cardid)
        {
            Card card = _repository.Get<Card>(cardid);
            return AutoMapper.Mapper.Map<IList<CardTask>, IList<CardTaskViewModel>>(card.Tasks.ToList());
        }

        // POST api/board/1/card/1/tasks
        [Route("")]
        public WebApiResult<CardTaskViewModel> Post([FromBody]AddCardTaskCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<CardTask>, WebApiResult<CardTaskViewModel>>(result);
        }

        // PUT api/board/1/card/1/tasks/1
        [Route("{id:int}")]
        public WebApiResult<CardTaskViewModel> Put(int id, [FromBody]UpdateCardTaskCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<CardTask>, WebApiResult<CardTaskViewModel>>(result);
        }

        // PUT api/board/1/card/1/tasks/1/complete
        [Route("{id:int}/complete")]
        public WebApiResult<CardTaskViewModel> PutComplete(int id, [FromBody]CompleteCardTaskCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<CardTask>, WebApiResult<CardTaskViewModel>>(result);
        }


        // DELETE api/board/1/card/1/tasks/1
        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteCardTaskCommand { CardTaskId = id  });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        } 


    }
}
