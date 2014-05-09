using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Security;

namespace Redfern.Core.Repository
{
    public class RedfernRepository : IRedfernRepository
    {
        RedfernDb _db;
        IUserCache<RedfernUser> _userCache;

        public RedfernRepository(RedfernContext context, IUserCache<RedfernUser> userCache)
        {
            _db = new RedfernDb(context);
            _userCache = userCache;
        }

        public T ExecuteCommand<T>(IRepositoryCommand<T> command)
        {
            return command.Execute(_db, _userCache);
            
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

        public IQueryable<Activity> Activities
        {
            get { return _db.Activities.Where(t => t.TenantId == _db.Context.TenantID).AsQueryable(); }
        }

        public IQueryable<CardAttachment> CardAttachments 
        {
            get { return _db.CardAttachments.Where(t => t.TenantId == _db.Context.TenantID).AsQueryable();  }
        }

    }
}
