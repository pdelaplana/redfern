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
        T ExecuteCommand<T>(IRepositoryCommand<T> command) where T : class;

        T Get<T>(int id) where T : class;

        IQueryable<Board> Boards { get; }
        IQueryable<Card> Cards { get; }
        IQueryable<Tag> Tags { get; }

    }
}
