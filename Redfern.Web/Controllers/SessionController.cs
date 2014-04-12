using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Redfern.Web.Controllers
{
    [Authorize]
    public class SessionController : Controller
    {
        //
        // GET: /session/keepalive
        public ActionResult KeepAlive()
        {
            return Content("OK");
        }
	}
}