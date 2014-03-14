using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Web.Models;

namespace Redfern.Web.Controllers
{
    public class BoardsController : Controller
    {

        private IRedfernRepository _repository;

        public BoardsController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        public ActionResult Index()
        {
            var list = _repository.Boards.ToList();
            var model = new BoardListViewModel();
            model.Boards = AutoMapper.Mapper.Map<IList<Board>, IList<BoardListItem>>(list);
            
            return PartialView("_index", model);
        }
	}
}