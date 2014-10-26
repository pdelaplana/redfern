using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Postal;
using Redfern.Security;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    [RoutePrefix("api/users")]
    [Authorize]
    public class UserController : ApiController
    {

        private RedfernUserManager UserManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().GetUserManager<RedfernUserManager>();
            }
        }
        
        public UserController()
        {
            
        }

        // GET api/user
        [Route("")]
        public IDictionary<string,string> Get(string name)
        {
            if (String.IsNullOrEmpty(name))
                return UserManager.Users.ToDictionary(key => key.UserName, value => value.FullName);
            else
                return UserManager.Users.Where(u => u.UserName.Contains(name) || u.FullName.Contains(name) || u.Email.Contains(name)).ToDictionary(key => key.UserName, value => value.FullName);
        }

        
        
        // ADDTOROLE api/users/id/add/admin
        [Route("{id}/add/{role}")]
        [HttpPost]
        public void AddToRole(string id, string role)
        {
            if (UserManager.GetRoles(id).Count(r => r == role) == 0)
                UserManager.AddToRole(id,role);
        }


        // REMOVEFROMROLE api/user/id?role=admin
        [Route("{id}/remove/{role}")]
        [HttpPost]
        public void RemoveFromRole(string id, string role)
        {            
            if (UserManager.GetRoles(id).Count(r=>r == role) > 0)
                UserManager.RemoveFromRole(id, role);
        }

        // SENDPASSWORDRESET api/user/id?role=admin
        [Route("{id}/sendpasswordreset")]
        [HttpPost]
        public void SendPasswordReset(string id)
        {
            var user =  UserManager.FindById(id);
            if (user == null || !(UserManager.IsEmailConfirmed(user.Id)))
            {
                
                // do something here
                return;
               
            }
            var code = UserManager.GeneratePasswordResetToken(id);
            var callbackUrl = Url.Link("Default", new { Controller = "account", Action = "resetpassword", userId = user.Id, code = code });
            
            // use Postal to send the email
            ResetPasswordEmail email = new ResetPasswordEmail();
            email.To = user.Email;
            email.UserFullName = user.FullName;
            email.ResetLink = callbackUrl;
            email.Send();
        }

        // ENABLE api/user/id
        [Route("{id}/enable")]
        [HttpPost]
        public void Enable(string id)
        {
            var user = UserManager.Users.Where(u => u.Id == id).SingleOrDefault();
            user.IsEnabled = true;
            UserManager.Update(user);
        }


        // DISABLE api/user/id
        [Route("{id}/disable")]
        [HttpPost]
        public void Disable(string id)
        {
            var user = UserManager.Users.Where(u => u.Id == id).SingleOrDefault();
            user.IsEnabled = false;
            UserManager.Update(user);
        }


        //UNLOCK api/user/id
        [Route("{id}/unlock")]
        [HttpPost]
        public void Unlock(string id)
        {
            var user = UserManager.Users.Where(u => u.Id == id).SingleOrDefault();
            user.LockoutEndDateUtc = null;
            UserManager.Update(user);
        }


        // DELETE api/user/id
        [Route("{id}")]
        public void Delete(string id)
        {
            var user = UserManager.Users.Where(u => u.Id == id).SingleOrDefault();
            UserManager.Delete(user);
        }
    }
}