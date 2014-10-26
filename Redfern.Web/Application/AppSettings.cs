using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Livefrog.Commons;

namespace Redfern.Web.Application
{
    public class AppSettings
    {
        public static string AdminEmail
        {
            get 
            {
                return AppSettingsAccessor.Setting<string>("AdminEmail");
            }
            set
            {
                AppSettingsAccessor.Setting<string>("AdminEmail");
            }
        }
    }
}