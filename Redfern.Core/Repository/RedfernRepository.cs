using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Security;

namespace Redfern.Core.Repository
{
    public class RedfernRepository : IRedfernRepository
    {
        RedfernDb _db;
        
        public RedfernRepository(RedfernContext context)
        {
            _db = new RedfernDb(context);
            
        }

        public CommandResult<T> ExecuteCommand<T>(IRepositoryCommand<T> command)
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

        public IQueryable<Activity> Activities
        {
            get { return _db.Activities.Where(t => t.TenantId == _db.Context.TenantID).AsQueryable(); }
        }

        public IQueryable<CardAttachment> CardAttachments 
        {
            get { return _db.CardAttachments.Where(t => t.TenantId == _db.Context.TenantID).AsQueryable();  }
        }

        public IQueryable<Notification> Notifications
        {
            get { return _db.Notifications.Where(t => t.TenantId == _db.Context.TenantID).AsQueryable(); }
        }

    }
}
