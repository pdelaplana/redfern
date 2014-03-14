using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Livefrog.Commons.Extensions;

namespace Redfern.Core.Models
{
    /*
    public class ActivityConstructor
    {
        private Activity _activity;

        protected void SetVerb(string verb)
        {
            _activity.Verb = verb;
        }

        protected void SetActor(string userName, string fullName)
        {
            // actor
            _activity.ActorType = "user";
            _activity.ActorId = userName;
            _activity.ActorDisplayName = fullName;
            _activity.ActorUrl = String.Format(@"/app/profile/{0}", _activity.ActorId);
            _activity.ActorImageUrl = String.Format(@"/app/profile/{0}/photo", _activity.ActorId);
        }

        protected void SetObject(string objectType, string objectId, string displayName, string url)
        {
            // object
            _activity.ObjectType = objectType;
            _activity.ObjectId = objectId;
            _activity.ObjectDisplayName = displayName.TruncateWithElipses(45);
            _activity.ObjectUrl = url;
        }

        protected void SetTarget(string targetType, string targetId, string displayName, string url)
        {
            _activity.TargetType = targetType;
            _activity.TargetId = targetId;
            _activity.TargetDisplayName = displayName.TruncateWithElipses(45);
            _activity.TargetUrl = url;
        }

        protected void SetContext(string contextType, string contextId, string displayName, string url)
        {
            _activity.ContextType = contextType;
            _activity.ContextId = contextId;
            _activity.ContextDisplayName = displayName.TruncateWithElipses(45);
            _activity.ContextUrl = url;
        }

        protected void SetDescription(string description)
        {
            _activity.Description = description;
        }

    }
     * */
}
