using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Redfern.Web.Areas.Boards.Controllers
{
    public class CreateController : Controller
    {
        //
        // GET: /Boards/Create/
        public ActionResult Index()
        {
            return PartialView();
        }
	}
}