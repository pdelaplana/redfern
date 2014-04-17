using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Redfern.Core.Security;
using Redfern.Web.Models;

namespace Redfern.Web.Controllers
{
    [Authorize]
    public class ProfileController : Controller
    {
        private UserManager<RedfernUser> _userManager;

        public ProfileController()
        {
            _userManager = new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
        }
        
        //
        // GET: /profile/
        public ActionResult Index()
        {
            var userAccount = _userManager.FindByName(User.Identity.Name);
            var model = AutoMapper.Mapper.Map<RedfernUser,ProfileViewModel>(userAccount);
            return PartialView("_index",model);
        }


        [HttpPost]
        public ActionResult UploadPhoto(HttpPostedFileBase photo, string userName)
        {
            if (String.IsNullOrEmpty(userName))
                userName = User.Identity.Name;
            ViewBag.PasswordChangedStatus = TempData["PasswordChangedStatus"];
            try
            {
                if (photo != null)
                {
                    var userAccount = this._userManager.FindByName(User.Identity.Name);
                    userAccount.AvatarContentType = photo.ContentType;
                    var tempData = new byte[photo.ContentLength];
                    photo.InputStream.Read(tempData, 0, photo.ContentLength);
                    userAccount.Avatar = tempData;
                    _userManager.Update(userAccount);
                    return RedirectToAction("UploadPhoto");

                }
                return Content("No file specified");
            }
            catch (Exception ex)
            {
                return Content("Error uploading file: " + ex.Message);
            }
        }

        public ActionResult Avatar(string user = "anon", int x = 16, int y = 16, string nopic = "~/Assets/Images/default-user-avatar.png")
        {
            WebImage webImage;
            if (String.IsNullOrEmpty(user)) user = "anon";
            var userAccount = this._userManager.FindByName(user);
            if (userAccount != null)
            {
                byte[] photo = userAccount.Avatar;
                if (photo != null)
                {
                    webImage = new WebImage(photo);
                    webImage.Resize(x, y);
                    return File(webImage.GetBytes(), userAccount.AvatarContentType, user + ".avatar");
                }
            }
            webImage = new WebImage(Server.MapPath(nopic));
            webImage.Resize(x, y);
            return File(webImage.GetBytes(), "image/png");
        }

        public ActionResult ChangePassword()
        {
            return PartialView("_ChangePassword", new ManageUserViewModel { UserName = User.Identity.Name });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ChangePassword(ManageUserViewModel model)
        {
            IdentityResult result =_userManager.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                TempData["PasswordChangedStatus"] = "Your password has been changed";
                return RedirectToAction("index");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error);
                }


                return PartialView("_ChangePassword");
            }

            
            
            
        }

	}
}