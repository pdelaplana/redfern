using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Livefrog.Commons.Extensions;

namespace Redfern.Core.Models
{
    public class Activity
    {
        [Key]
        public int ActivityId { get; set; }

        public DateTime ActivityDate { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; }

        [MaxLength(20)]
        public string Verb { get; set; }

        [MaxLength(20)]
        public string ActorId { get; set; }

        [MaxLength(50)]
        public string ActorDisplayName { get; set; }

        [MaxLength(20)]
        public string ActorType { get; set; }

        [MaxLength(100)]
        public string ActorUrl { get; set; }

        [MaxLength(100)]
        public string ActorImageUrl { get; set; }

        [MaxLength(20)]
        public string ObjectId { get; set; }

        [MaxLength(50)]
        public string ObjectDisplayName { get; set; }

        [MaxLength(20)]
        public string ObjectType { get; set; }

        [MaxLength(100)]
        public string ObjectUrl { get; set; }

        [MaxLength(100)]
        public string ObjectImageUrl { get; set; }

        [MaxLength(20)]
        public string TargetId { get; set; }

        [MaxLength(50)]
        public string TargetDisplayName { get; set; }

        [MaxLength(20)]
        public string TargetType { get; set; }

        [MaxLength(100)]
        public string TargetUrl { get; set; }

        [MaxLength(100)]
        public string TargetImageUrl { get; set; }

        [MaxLength(20)]
        public string ContextId { get; set; }

        [MaxLength(50)]
        public string ContextDisplayName { get; set; }

        [MaxLength(20)]
        public string ContextType { get; set; }

        [MaxLength(100)]
        public string ContextUrl { get; set; }

        [MaxLength(100)]
        public string ContextImageUrl { get; set; }

        [MaxLength(500)]
        public string AdditionalData { get; set; }

        
        public void SetVerb(string verb)
        {
            this.Verb = verb;
        }


        public void SetActor(string userName, string fullName)
        {
            // actor
            this.ActorType = "user";
            this.ActorId = userName;
            this.ActorDisplayName = fullName;
            this.ActorUrl = String.Format(@"/app/profile/{0}", this.ActorId);
            this.ActorImageUrl = String.Format(@"/app/profile/{0}/photo", this.ActorId);
        }

        public void SetObject(string objectType, string objectId, string displayName, string url)
        {
            // object
            this.ObjectType = objectType;
            this.ObjectId = objectId;
            this.ObjectDisplayName = displayName.TruncateWithElipses(45);
            this.ObjectUrl = url;
        }

        public void SetTarget(string targetType, string targetId, string displayName, string url)
        {
            this.TargetType = targetType;
            this.TargetId = targetId;
            this.TargetDisplayName = displayName.TruncateWithElipses(45);
            this.TargetUrl = url;
        }

        public void SetContext(string contextType, string contextId, string displayName, string url)
        {
            this.ContextType = contextType;
            this.ContextId = contextId;
            this.ContextDisplayName = displayName.TruncateWithElipses(45);
            this.ContextUrl = url;
        }

        public void SetDescription(string description)
        {
            this.Description = description;
        }

    }
}
