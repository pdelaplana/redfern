using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Redfern.Core.Security;



namespace Redfern.Web.API
{
    [Authorize]
    public class UserController : ApiController
    {

        private RedfernSecurityContext _context;
        
        public UserController()
        {
            _context = new RedfernSecurityContext();
        }

        // GET api/user
        public IDictionary<string,string> Get(string name)
        {
            return _context.Users.Where(u => u.UserName.Contains(name) || u.FullName.Contains(name) || u.Email.Contains(name)).ToDictionary(key => key.UserName, value => value.FullName);
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