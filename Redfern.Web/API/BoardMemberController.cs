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

        // POST api/boardmember
        public BoardMemberItem Post([FromBody]AddBoardMemberCommand command)
        {
            var board = _repository.Get<Board>(command.BoardId);
            var member = board.Members.Where(m => m.UserName == command.UserName).SingleOrDefault();
            if (member != null) 
                return AutoMapper.Mapper.Map<BoardMember,BoardMemberItem>(member);
            // else
            return AutoMapper.Mapper.Map<BoardMember, BoardMemberItem>(_repository.ExecuteCommand(command));
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            _repository.ExecuteCommand(new DeleteBoardMemberCommand { BoardMemberId = id });
        }
    }
}