using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Redfern.Core;
using Redfern.Core.Cache;
using Redfern.Security;
using Redfern.Web.Application.Cache;
using Redfern.Web.Models;


namespace Redfern.Web.Controllers
{
    [Authorize]
    public class AppController : Controller
    {

        private UserManager<RedfernUser> _userManager;
        
        public AppController(RedfernContext context, IUserCache<RedfernUser> cache)
        {
            _userManager = new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
            //cache.Init();
        }


        //
        // GET: /app
        public ActionResult Index()
        {           
            ViewBag.AuthenticatedUser = AutoMapper.Mapper.Map<RedfernUser, ProfileViewModel>(_userManager.FindByName(User.Identity.GetUserName()));
            HttpCookie cookie = new HttpCookie("AuthenticatedUser");
            cookie.Value = JsonConvert.SerializeObject(ViewBag.AuthenticatedUser);
            this.ControllerContext.HttpContext.Response.Cookies.Add(cookie);
            return View();
        }

        public ActionResult Credits()
        {
            return PartialView("_Credits");
        }
	}
}