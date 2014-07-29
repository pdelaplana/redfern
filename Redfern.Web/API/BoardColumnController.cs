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
    [RoutePrefix("api/board/{boardid:int}/columns")]
    [Authorize]
    public class BoardColumnController : ApiController
    {
        private IRedfernRepository _repository;

        public BoardColumnController(IRedfernRepository repository)
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

        
        // POST api/board/1/columns
        [Route("")]
        public WebApiResult<BoardColumnItem> Post([FromBody]CreateBoardColumnCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<BoardColumn>, WebApiResult<BoardColumnItem>>(result);
        }

        // PUT api/board/1/columns/5
        [Route("{id:int}")]
        public WebApiResult<BoardColumnItem> Put(int id, [FromBody]UpdateBoardColumnPropertiesCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<BoardColumn>, WebApiResult<BoardColumnItem>>(result);
        }

        // PUT api/board/1/columns/5/hide
        [Route("{id:int}/hide")]
        [HttpPut]
        public WebApiResult<BoardColumnItem> Hide(int id, [FromBody]UpdateBoardColumnPropertiesCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<BoardColumn>, WebApiResult<BoardColumnItem>>(result);
        }

        // PUT api/board/1/columns/5/show
        [Route("{id:int}/show")]
        [HttpPut]
        public WebApiResult<BoardColumnItem> Show(int id, [FromBody]UpdateBoardColumnPropertiesCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<BoardColumn>, WebApiResult<BoardColumnItem>>(result);
        }


        // DELETE api/board/1/columns/5
        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteBoardColumnCommand { ColumnId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }

        //POST api/board/1/columns/resequence
        [Route("resequence")]
        [HttpPost]
        public WebApiResult<BoardColumnItem> Resequence([FromBody]ResequenceBoardColumnsCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<BoardColumn>, WebApiResult<BoardColumnItem>>(result);
        }

    }
}