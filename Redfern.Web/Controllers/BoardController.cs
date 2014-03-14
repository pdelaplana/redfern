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
    public class BoardController : Controller
    {
        private IRedfernRepository _repository;

        public BoardController(IRedfernRepository repository)
        {
            _repository = repository;

        }

        public ActionResult Index(int id)
        {
            var model = AutoMapper.Mapper.Map<Board, BoardViewModel>(_repository.Get<Board>(id));
            return PartialView("_index", model);
        }
	}
}