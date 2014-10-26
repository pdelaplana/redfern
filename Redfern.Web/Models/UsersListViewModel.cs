using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class UserListItem
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string[] Roles { get; set; }
        public bool? IsLockedOut{ get; set; }
        public bool? IsEnabled { get; set; }
        public bool? EmailConfirmed { get; set; }
        public DateTime? SignupDate { get; set; }
        public DateTime? LastSigninDate { get; set; }
        public int NumberOfBoardsOwned { get; set; }
        
    }

    public class UsersListViewModel
    {
        public IList<UserListItem> Users { get; set; }
    }
}