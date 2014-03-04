using System.Web.Mvc;

namespace Redfern.Web.Areas.Boards
{
    public class BoardsAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Boards";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                name: "BoardDetail",
                url: "board/{id}/{action}",
                defaults: new { action = "index", controller = "board", id = UrlParameter.Optional },
                constraints: new { id = @"\d+" }
                //namespaces: new string[] { "Redfern.Web.Areas.Boards" }
            );

            context.MapRoute(
                "Board_default",
                "boards/{controller}/{action}/{id}",
                new { action = "index", controller = "collection", id = UrlParameter.Optional }
            );
        }
    }
}