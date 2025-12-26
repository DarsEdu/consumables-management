using System;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace ConsumablesApp
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            // Register Web API
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // Route all non-API requests to index.html
            RouteTable.Routes.MapPageRoute(
                "Default",
                "{*path}",
                "~/index.html"
            );
        }
    }
}

