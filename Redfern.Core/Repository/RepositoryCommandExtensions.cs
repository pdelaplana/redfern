using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Repository
{
    public static class RepositoryCommandExtensions
    {
        public static CommandResult<TData> CommandResult<TData>(this IRepositoryCommand<TData> command, TData data, RedfernDb db, Activity activity)
        {
            return new CommandResult<TData>
            {
                Data = data,
                ActivityContext = new ActivityContext 
                {
                    Description = activity.Description,
                    ActivityDate = activity.ActivityDate,
                    Verb = activity.Verb,
                    ActorId = activity.ActorId,
                    ActorDisplayName = activity.ActorDisplayName,
                    ObjectId = activity.ObjectId,
                    ObjectType = activity.ObjectType,
                    ObjectDisplayName = activity.ObjectDisplayName,
                    SourceId = activity.SourceId,
                    SourceType = activity.SourceType,
                    SourceDisplayName = activity.SourceDisplayName,
                    TargetId = activity.TargetId,
                    TargetType = activity.TargetType,
                    TargetDisplayName = activity.TargetDisplayName,
                    ContextId = activity.ContextId,
                    ContextType = activity.ContextType,
                    ContextDisplayName = activity.ContextDisplayName,
                    AdditionalData = activity.AdditionalData
                },
                CommandContext = new CommandContext 
                {
                    Initiator = db.Context.ClientUserName,
                    ExecutionTime = DateTime.UtcNow
                }
            };
        }

        public static CommandResult<TData> CommandResult<TData>(this IRepositoryCommand<TData> command, TData data, RedfernDb db, DateTime? activityDate = null, string actorId = null, string description = null)
        {
            return new CommandResult<TData>
            {
                Data = data,
                ActivityContext = new ActivityContext
                {
                    ActivityDate = activityDate != null ? activityDate.Value : DateTime.UtcNow,
                    Description = description,
                    ActorId = actorId
                },
                CommandContext = new CommandContext
                {
                    Initiator = db.Context.ClientUserName,
                    ExecutionTime = DateTime.UtcNow
                }


            };
        }
    }
}
