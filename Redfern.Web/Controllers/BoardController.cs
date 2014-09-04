using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
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
            BoardMember member = board.Members.Where(m => m.UserName == User.Identity.Name).SingleOrDefault();
           
            if (board.Owner == User.Identity.Name)
                accessList = AccessControlList.ForOwner;
            else if (member != null)
                accessList = AccessControlList.ForCollaborator;
            else
                accessList = AccessControlList.ForViewer;
            
            var model = AutoMapper.Mapper.Map<Board, BoardViewModel>(board);
            model.LastAccessedDate = member != null ? member.LastAccessedDate : null;
            model.AccessList = AutoMapper.Mapper.Map<RedfernAccessType[], string[]>(accessList);

            // update the lastaccesseddate
            _repository.ExecuteCommand(new UpdateBoardAccessedDateCommand { BoardId = board.BoardId, UserName = User.Identity.Name });

            return PartialView("_index", model);
        }
	}
}