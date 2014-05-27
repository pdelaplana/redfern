﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Security;

namespace Redfern.Core.Repository.Commands
{
    public class ChangeBoardVisibilityCommand : IRepositoryCommand<Board>
    {
        public int BoardId { get; set; }
        public bool IsPublic { get; set; }


        public Board Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Board board = db.Boards.Find(this.BoardId);
            board.IsPublic = this.IsPublic;
            db.SaveChanges();

            string visibility = board.IsPublic ? "public" : "private";

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("change");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("board", board.BoardId.ToString(), board.Name, String.Format(@"/board/{0}", board.BoardId));
            activity.SetDescription("{actorlink} change visibility of board {objectlink} to " + visibility + ".");
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return board;
        }

        
    }
}