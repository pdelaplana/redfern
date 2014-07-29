using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Models
{
    public static class RedfernDbExtensions
    {
        public static string GetUserFullName(this RedfernDb db, string userName)
        {
            var user = db.SecurityContext.Users.Where(u => u.UserName == userName).SingleOrDefault();
            if (user != null)
                return user.FullName;
            else
                return "";
        }

        public static Activity CreateActivity(this RedfernDb db)
        {
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            return activity;
        }

        
    }
}
