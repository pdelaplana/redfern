using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Postal;

namespace Redfern.Web.Models
{
    public class ResetPasswordEmail : Email
    {
        public string To { get; set; }
        public string UserFullName { get; set; }
        public string ResetLink { get; set; }
        public string Code { get; set; }
    }

    public class EmailConfirmationEmail : Email
    {
        public string To { get; set; }
        public string UserFullName { get; set; }
        public string ConfirmEmailLink { get; set; }
        public string Code { get; set; }

    }

    public class NewUserRegistrationEmail : Email
    {
        public string To { get; set; }
        public string NewUserName { get; set; }
        public string NewUserFullName { get; set; }
        public string NewUserEmailAddress { get; set; }


    }
}