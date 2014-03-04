using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Redfern.Web.Controllers
{
    [Authorize]
    public class AppController : Controller
    {
        //
        // GET: /Boards/
        public ActionResult Index()
        {
            return View();
        }
	}
}