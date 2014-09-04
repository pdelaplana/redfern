using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Livefrog.Commons.Helpers;
using Redfern.Core;
using Redfern.Web.Application.Cache;


namespace Redfern.Web.Application
{
    public class RedfernWebContext : RedfernContext
    {
        public RedfernWebContext(TenantsCache tenantsCache, UserCache userCache)
        {
            //TODO: Obtaining the client user name and IP address from HTTPContext makes an assumption that 
            //      HTTPRequest is always available,this is not always the e.g. Application Start.  As a workaround, 
            //      I have put in a try... catch block to handle situation where the HTTPRequest is not available.
            //      Futurewise, we need to refactor this to remove this dependency on the HTTPContext
            try
            {
                if ((HttpContext.Current.User != null) && (!String.IsNullOrEmpty(HttpContext.Current.User.Identity.Name)))
                {
                    this.ClientUserName = HttpContext.Current.User.Identity.Name;
                    this.ClientUserFullName = userCache.GetFullName(this.ClientUserName);
                    if (HttpContext.Current.Session != null)
                        HttpContext.Current.Session["ClientUserName"] = this.ClientUserName;
                    if (HttpContext.Current.Session != null)
                        HttpContext.Current.Session["ClientUserFullName"] = this.ClientUserFullName;
                }
                else 
                {
                    // check if we've kept ClientUserName and ClientUserFullName in the session
                    if (HttpContext.Current.Session != null)
                    {
                        this.ClientUserName = HttpContext.Current.Session["ClientUserName"] != null ? (String)HttpContext.Current.Session["ClientUserName"] : "Anonymous";
                        this.ClientUserFullName = HttpContext.Current.Session["ClientUserFullName"] != null ? (String)HttpContext.Current.Session["ClientUserFullName"] : "Anonymous";
                    }
                    else
                    {
                        this.ClientUserName = "Anonymous";
                        this.ClientUserFullName = "Anonymous";
                    }
                    
                }
                
                    
                this.ClientIpAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"].ToString();
                this.ClientTimeZone = ClientTimeZoneHelper.UserTimeZone;
                string host = HttpContext.Current.Request.Headers["Host"].Split(':')[0];

                var tenant = tenantsCache.GetTenantByHost(host);
                if (tenant == null)
                    // use default
                    tenant = tenantsCache.GetTenantByName("Default");

                this.TenantID = tenant.TenantId;

                this.DbServer = tenant.DbServer;
                this.DbName = tenant.DbName;
                this.DbUser = tenant.DbUser;
                this.DbPassword = tenant.DbPassword;
                //this.Metadata = @"res://*/Models.TractionModel.csdl|res://*/Models.TractionModel.ssdl|res://*/Models.TractionModel.msl";
            }
            catch
            {

            }
            
        }
    }
}