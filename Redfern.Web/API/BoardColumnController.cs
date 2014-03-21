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

        // POST api/boardcolumn
        public BoardColumnItem Post([FromBody]CreateBoardColumnCommand command)
        {
            var column = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<BoardColumn, BoardColumnItem>(column);
        }

        // PUT api/boardcolumn/5
        public BoardColumnItem Put(int id, [FromBody]UpdateBoardColumnPropertiesCommand command)
        {
            var column = _repository.ExecuteCommand(command);
            return AutoMapper.Mapper.Map<BoardColumn, BoardColumnItem>(column);
        }

        // DELETE api/boardcolumn/5
        public void Delete(int id)
        {
            _repository.ExecuteCommand(new DeleteBoardColumnCommand { ColumnId = id });
        }

        [AcceptVerbs("resequence")]
        public void Resequence([FromBody]ResequenceBoardColumnsCommand command)
        {
            _repository.ExecuteCommand(command);
        }

    }
}