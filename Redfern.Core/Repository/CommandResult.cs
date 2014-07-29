using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Redfern.Core.Repository
{
    public struct CommandContext
    {
        public DateTime ExecutionTime;
        public string Initiator;
    }

    public struct ActivityContext
    {
        public string Text;
        public string Description;
        public DateTime ActivityDate;
        public string Verb;

        public string ActorId;

        public string ActorDisplayName;
        public string ActorType;
        public string ActorUrl;
        public string ActorImageUrl;

        public string ObjectId;
        public string ObjectDisplayName;
        public string ObjectType;
        public string ObjectUrl;
        public string ObjectImageUrl;

        public string SourceId;
        public string SourceDisplayName;
        public string SourceType;
        public string SourceUrl;
        public string SourceImageUrl;

        public string TargetId;
        public string TargetDisplayName;
        public string TargetType;
        public string TargetUrl;
        public string TargetImageUrl;

        public string ContextId;
        public string ContextDisplayName;
        public string ContextType;
        public string ContextUrl;
        public string ContextImageUrl;

        public string AdditionalData;

    }

    public class CommandResult<T>
    {
        public string ResultCode { get; set; }
        public string ResultText { get; set; }

        public ActivityContext ActivityContext;
        public CommandContext CommandContext;

        public T Data { get; set; }

    }
}
