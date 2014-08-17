using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{

    public class ActivityListItem
    {
        public int ActivityId { get; set; }
        public DateTime ActivityDate { get; set; }
     
        public string Description { get; set; }

        public string Verb { get; set; }
        public string Attribute { get; set; }

        public string ActorId { get; set; }
        public string ActorDisplayName { get; set; }
        public string ActorType { get; set; }
        public string ActorUrl { get; set; }
        public string ActorImageUrl { get; set; }

        
        public string ObjectId { get; set; }
        public string ObjectDisplayName { get; set; }
        public string ObjectType { get; set; }
        public string ObjectUrl { get; set; }
        public string ObjectImageUrl { get; set; }

        public string SourceId { get; set; }
        public string SourceDisplayName { get; set; }
        public string SourceType { get; set; }
        public string SourceUrl { get; set; }
        public string SourceImageUrl { get; set; }

        public string TargetId { get; set; }
        public string TargetDisplayName { get; set; }
        public string TargetType { get; set; }
        public string TargetUrl { get; set; }
        public string TargetImageUrl { get; set; }

        public string ContextId { get; set; }
        public string ContextDisplayName { get; set; }
        public string ContextType { get; set; }
        public string ContextUrl { get; set; }
        public string ContextImageUrl { get; set; }

        public string AdditionalData { get; set; }

    }

    public class ActivityListViewModel
    {
        public IList<ActivityListItem> Activities { get; set; }
    }
}