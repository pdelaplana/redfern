﻿using System;
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
    public class UpdateCardCommentCommand : IRepositoryCommand<CardComment>
    {
        public int CardId { get; set; }
        public int CardCommentId { get; set; }
        public string Comment { get; set; }
        
        public CommandResult<CardComment> Execute(RedfernDb db)
        {
            CardComment comment = db.CardComments.Find(this.CardCommentId);
            comment.Comment = this.Comment;
            comment.CommentDate = DateTime.UtcNow;
            comment.CommentByUser = db.Context.ClientUserName;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("updated");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("comment", comment.CommentId.ToString(), comment.Comment.Substring(0,comment.Comment.Length < 50 ? comment.Comment.Length-1 : 50), 
                String.Format(@"/board/{0}/card/{1}/comment/{2}", comment.Card.BoardId.ToString(), comment.Card.CardId.ToString(), comment.CommentId.ToString()));
            activity.SetTarget("card", comment.CardId.ToString(), comment.Card.Title, "");
            activity.SetContext("board", comment.Card.BoardId.ToString(), comment.Card.Board.Name, String.Format(@"/board/{0}", comment.Card.BoardId));
            activity.SetDescription("{actorlink} updated comment for {target} in {context}");
            activity.AdditionalData = comment.Comment;
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<CardComment>(comment, db,activity);
            
        }
    }
}
