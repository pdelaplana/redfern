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
    public class BoardController : ApiController
    {
        private IRedfernRepository _repository;
        
        public BoardController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<BoardListItem> Get(string id)
        {

            var list = _repository.Boards.Where(b => b.Owner == id || b.Members.Where(m => m.UserName == id).Count() > 0).ToList();
            return AutoMapper.Mapper.Map<IList<Board>, IList<BoardListItem>>(list);
        }

        public BoardListItem Post([FromBody]CreateBoardCommand command)
        {
            return AutoMapper.Mapper.Map<Board, BoardListItem>(_repository.ExecuteCommand(command));
        }

        public void Put(int id, [FromBody]ChangeBoardNameCommand command)
        {
            _repository.ExecuteCommand(command);
        }

        public void Delete(int id)
        {
            _repository.ExecuteCommand(new DeleteBoardCommand { BoardId = id });
        }


       
    }
}
