﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Redfern.Web.Areas.Boards.Controllers
{
    public class BoardController : Controller
    {
        public ActionResult Index()
        {
            return PartialView("_index");
        }
	}
}