using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Repository
{
    public interface IRedfernRepository
    {
        CommandResult<T> ExecuteCommand<T>(IRepositoryCommand<T> command);
        
        T Get<T>(int id) where T : class;

        IQueryable<Board> Boards { get; }
        IQueryable<Card> Cards { get; }
        IQueryable<Tag> Tags { get; }
        IQueryable<Activity> Activities { get; }
        IQueryable<CardAttachment> CardAttachments { get; }


    }
}
