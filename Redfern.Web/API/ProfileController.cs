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
using Redfern.Core.Security;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    [Authorize]
    public class ProfileController : ApiController
    {
        private RedfernUserManager UserManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().GetUserManager<RedfernUserManager>();
            }
        }

        public ProfileController()
        {
            
            
        }
        

        // GET api/profile
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {

        }

        // PUT api/profile/5
        public Task<IdentityResult> Put(string id, [FromBody]ProfileViewModel model)
        {
            var user = UserManager.FindByName(model.UserName);
            user.FullName = model.FullName;
            user.Email = model.Email;
            return UserManager.UpdateAsync(user);
        }

        [AcceptVerbs("changepassword")]
        public Task<IdentityResult> ChangePassword(string id, [FromBody]ManageUserViewModel model) 
        {
            return UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword); 

        }

        
        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}