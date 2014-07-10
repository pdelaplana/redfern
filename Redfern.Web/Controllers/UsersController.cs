using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Redfern.Security;
using Redfern.Web.Models;
using Redfern.Web.Application;

namespace Redfern.Web.Controllers
{
    [Authorize]
    public class UsersController : Controller
    {
        private RedfernWebContext _context;

        private RedfernUserManager UserManager
        {
            get
            {
                return HttpContext.GetOwinContext().GetUserManager<RedfernUserManager>();
            }
        }

        public UsersController(RedfernWebContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public ActionResult Index()
        {
            var model = new UsersListViewModel {
                Users = AutoMapper.Mapper.Map<IList<RedfernUser>, IList<UserListItem>>(UserManager.Users.Where(u=>u.TenantId == _context.TenantID ).ToList())
            };
            return PartialView("_index", model);   
        }
	}
}