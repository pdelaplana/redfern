using System.Web;
using System.Web.Mvc;
using Livefrog.Commons.Attributes;

namespace Redfern.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ActionExecutionTimeAttribute());
            filters.Add(new ApplicationInfoAttribute(typeof(MvcApplication)));
            filters.Add(new HandleErrorAttribute());
        }
    }
}
