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



namespace Redfern.Web.API
{
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
        public IDictionary<string,string> Get(string name)
        {
            if (String.IsNullOrEmpty(name))
                return UserManager.Users.ToDictionary(key => key.UserName, value => value.FullName);
            else
                return UserManager.Users.Where(u => u.UserName.Contains(name) || u.FullName.Contains(name) || u.Email.Contains(name)).ToDictionary(key => key.UserName, value => value.FullName);
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

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}