using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
using Redfern.Web.Hubs;
using Redfern.Web.Models;


namespace Redfern.Web.API
{
    [RoutePrefix("api/board/{boardid:int}/cards")]
    [Authorize]
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

        // POST api/board/1/cards
        [Route("")]
        public WebApiResult<CardItem> Post([FromBody]CreateCardCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Card>, WebApiResult<CardItem>>(result); 
        }

        // PUT api/board/1/card/5
        [Route("{id:int}")]
        public WebApiResult<CardItem> Put(int id, [FromBody]UpdateCardCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Card>, WebApiResult<CardItem>>(result);
        }

        // PUT api/board/1/card/5/duedate
        [Route("{id:int}/duedate")]
        public WebApiResult<CardItem> PutDueDate(int id, [FromBody]SetCardDueDateCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Card>, WebApiResult<CardItem>>(result);
        }

        // DELETE api/board/1/card/5
        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteCardCommand { CardId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }

        // POST api/board/1/card/resequence
        [Route("resequence")]
        [HttpPost]
        public WebApiResult<CardItem> Resequence([FromBody]ResequenceCardsCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Card>, WebApiResult<CardItem>>(result);
        }

        [AcceptVerbs("archive")]
        public void Archive(int id)
        {
            _repository.ExecuteCommand(new ArchiveCardCommand { CardId = id });
        }

        [AcceptVerbs("unarchive")]
        public void Unarchive(int id)
        {
            _repository.ExecuteCommand(new UnarchiveCardCommand { CardId = id });
        }

        [Route("{id:int}/assign")]
        [HttpPost]
        public WebApiResult<CardItem> Assign(int id, [FromBody]AssignCardCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Card>, WebApiResult<CardItem>>(result);
        }

        [Route("{id:int}/color")]
        [HttpPost]
        public WebApiResult<CardItem> Color(int id, [FromBody]ChangeCardColorCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Card>, WebApiResult<CardItem>>(result);
        }


    }
}