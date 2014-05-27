using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Web.Application;
using Redfern.Web.Models;

namespace Redfern.Web.Controllers
{
    [Authorize]
    public class BoardController : Controller
    {
        private IRedfernRepository _repository;

        public BoardController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        public ActionResult Index(int id)
        {
            RedfernAccessType[] accessList;
            Board board = _repository.Get<Board>(id);

            if (board.Owner == User.Identity.Name)
                accessList = AccessControlList.ForOwner;
            else if (board.Members.Count(member => member.UserName == User.Identity.Name)>0)
                accessList = AccessControlList.ForCollaborator;
            else
                accessList = AccessControlList.ForViewer;
            
            var model = AutoMapper.Mapper.Map<Board, BoardViewModel>(board);
            model.AccessList = AutoMapper.Mapper.Map<RedfernAccessType[], string[]>(accessList);
            return PartialView("_index", model);
        }
	}
}