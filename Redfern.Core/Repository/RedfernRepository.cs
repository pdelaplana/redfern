using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core;
using Redfern.Core.Models;

namespace Redfern.Core.Repository
{
    public class RedfernRepository : IRedfernRepository
    {
        RedfernDb _db;

        public RedfernRepository(RedfernContext context)
        {
            _db = new RedfernDb(context);
        }

        public T ExecuteCommand<T>(IRepositoryCommand<T> command) where T : class
        {
            return command.Execute(_db);
            
        }

        public T Get<T>(int id) where T : class
        {
            return _db.Set<T>().Find(id);
        }

        public IQueryable<Board> Boards
        {
            get { return _db.Boards.Where(b => b.TenantId == _db.Context.TenantID).AsQueryable(); }
        }

        public IQueryable<Card> Cards
        {
            get { return _db.Cards.Where(c => c.TenantId == _db.Context.TenantID).AsQueryable(); }
        }

        public IQueryable<Tag> Tags
        {
            get { return _db.Tags.Where(t => t.TenantId == _db.Context.TenantID).AsQueryable(); }
        }
    }
}
