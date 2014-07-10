using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class CreateCardCommentCommand : IRepositoryCommand<CardComment>
    {
        public int CardId { get; set; }
        public string Comment { get; set; }
        
        public CardComment Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            CardComment comment = db.CardComments.Create();
            comment.CardId = this.CardId;
            comment.Comment = this.Comment;
            comment.CommentDate = DateTime.UtcNow;
            comment.CommentByUser = db.Context.ClientUserName;
            comment = db.CardComments.Add(comment);
            db.SaveChanges();
            return comment;
        }
    }
}
