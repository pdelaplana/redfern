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
    [RoutePrefix("api/board/{boardid:int}/card/{cardid:int}/tags")]
    [Authorize]
    public class CardTagController : ApiController
    {
        private IRedfernRepository _repository;

        public CardTagController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // POST api/board/1/card/1/tags
        [Route("")]
        public WebApiResult<CardTagItem> Post([FromBody]CreateCardTagCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<CardTag>, WebApiResult<CardTagItem>>(result);
        }

        // DELETE api/tag/
        [Route("")]
        public WebApiResult<string> Delete([FromBody]DeleteCardTagCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<string>, WebApiResult<string>>(result);

        }

    }
}
