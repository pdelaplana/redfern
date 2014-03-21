using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web;
using System.Web.Mvc;
using Redfern.Core.Security;
using Redfern.Web.Models;

namespace Redfern.Web.Controllers
{
    [Authorize]
    public class AppController : Controller
    {

        private UserManager<RedfernUser> _userManager;

        public AppController()
        {
            _userManager = new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
        }


        //
        // GET: /Boards/
        public ActionResult Index()
        {
            ViewBag.AuthenticatedUser = AutoMapper.Mapper.Map<RedfernUser, ProfileViewModel>(_userManager.FindByName(User.Identity.GetUserName()));
            return View();
        }
	}
}