using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    public class CommandContext
    {
        public DateTime ExecutionTime;
        public string Initiator;
    }

    public class ActivityContext : ActivityListItem
    {
        
    }

    public class WebApiResult<T>
    {
        public T Data { get; set; }
        public ActivityContext ActivityContext { get; set; }
        public CommandContext CommandContext { get; set; }
    }
}