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
    [RoutePrefix("api/boards")]
    [Authorize]
    public class BoardController : ApiController
    {
        private IRedfernRepository _repository;
        
        public BoardController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        [Route("list/{userId}")]
        public IEnumerable<BoardListItem> Get(string userId)
        {
            var list = _repository.Boards.Where(b => b.Owner == userId || b.IsPublic || b.Members.Where(m => m.UserName == userId).Count() > 0).ToList();
            return AutoMapper.Mapper.Map<IList<Board>, IList<BoardListItem>>(list);
        }

        [Route("")]
        public WebApiResult<BoardListItem> Post([FromBody]CreateBoardCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Board>, WebApiResult<BoardListItem>>(result);
        }

        [Route("{id:int}")]
        public WebApiResult<BoardListItem> Put(int id, [FromBody]ChangeBoardNameCommand command)
        {
            var result =_repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Board>, WebApiResult<BoardListItem>>(result);
        }

        [Route("{id:int}/changevisibility")]
        [HttpPost]
        public WebApiResult<BoardListItem> ChangeVisibility(int id, [FromBody]ChangeBoardVisibilityCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Board>, WebApiResult<BoardListItem>>(result);
        }

        [Route("{id:int}/archive")]
        [HttpPost]
        public WebApiResult<BoardListItem> Archive(int id, [FromBody]ArchiveBoardCommand  command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Board>, WebApiResult<BoardListItem>>(result);
        }

        [Route("{id:int}/unarchive")]
        [HttpPost]
        public WebApiResult<BoardListItem> Archive(int id, [FromBody]UnarchiveBoardCommand command)
        {
            var result = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<CommandResult<Board>, WebApiResult<BoardListItem>>(result);
        }

        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteBoardCommand { BoardId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }


       
    }
}
