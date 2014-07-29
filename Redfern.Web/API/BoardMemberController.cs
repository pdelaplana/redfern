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
    [RoutePrefix("api/board/{boardid:int}/members")]
    [Authorize]
    public class BoardMemberController : ApiController
    {

        private IRedfernRepository _repository;

        public BoardMemberController(IRedfernRepository repository)
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

        // POST api/board/1/members
        [Route("")]
        public WebApiResult<BoardMemberItem> Post([FromBody]AddBoardMemberCommand command)
        {
           
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<BoardMember>, WebApiResult<BoardMemberItem>>(result);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/board/1/members/5
        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteBoardMemberCommand { BoardMemberId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }
    }
}