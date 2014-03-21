using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Redfern.Core.Security;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    public class ProfileController : ApiController
    {
        private UserManager<RedfernUser> _userManager;

        public ProfileController()
        {
            _userManager = new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
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
        public void Put(string id, [FromBody]ProfileViewModel model)
        {
            var user = _userManager.FindByName(model.UserName);
            user.FullName = model.FullName;
            user.Email = model.Email;
            _userManager.Update(user);
        }

     

       
        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}