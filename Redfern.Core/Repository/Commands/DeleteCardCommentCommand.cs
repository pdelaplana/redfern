﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Security;

namespace Redfern.Core.Repository.Commands
{
    public class DeleteCardCommentCommand : IRepositoryCommand<bool>
    {
        public int CardCommentId { get; set; }
        
        public bool Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            CardComment comment = db.CardComments.Find(this.CardCommentId);
            
            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("deleted");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("comment", comment.CommentId.ToString(), "", "");
            activity.SetSource("card", comment.CardId.ToString(), comment.Card.Title, "");
            activity.SetContext("board", comment.Card.BoardId.ToString(), comment.Card.Board.Name, String.Format(@"/board/{0}", comment.Card.BoardId));
            activity.SetDescription("<b>{actorlink}</b> deleted <b>{object}</b> from {sourcelink} in {contextlink}");
            activity = db.Activities.Add(activity);

            db.CardComments.Remove(comment);
            db.SaveChanges();

            return true;
        }
    }
}