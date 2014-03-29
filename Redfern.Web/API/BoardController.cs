using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;

namespace Redfern.Web.API
{
    public class BoardController : ApiController
    {
        private IRedfernRepository _repository;
        
        public BoardController(IRedfernRepository repository)
        {
            _repository = repository;
        }
        
        public Board Post([FromBody]CreateBoardCommand command)
        {
            return _repository.ExecuteCommand(command);
        }

        public void Put(int id, [FromBody]ChangeBoardNameCommand command)
        {
            _repository.ExecuteCommand(command);
        }
    }
}
