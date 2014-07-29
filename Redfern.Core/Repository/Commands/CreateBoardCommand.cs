using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Security;

namespace Redfern.Core.Repository.Commands
{
    public class CreateBoardCommand : IRepositoryCommand<Board>
    {
        public string Name { get; set; }
        public bool IsPublic { get; set; }

        public CommandResult<Board> Execute(RedfernDb db)
        {
            Board board = db.Boards.Create();
            board.Name = this.Name;
            board.IsPublic = this.IsPublic;
            board.Owner = db.Context.ClientUserName;
            board = db.Boards.Add(board);
            db.SaveChanges();

            // create archived column
            BoardColumn archivedColumn = db.BoardColumns.Create();
            archivedColumn.BoardId = board.BoardId;
            archivedColumn.Name = "Archived";
            archivedColumn.Sequence = 1;
            archivedColumn.Hidden = true;
            archivedColumn = db.BoardColumns.Add(archivedColumn);
            db.SaveChanges();

            // create CardTypes
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Amber", ColorCode = "amber" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Yellow", ColorCode = "yellow" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Red", ColorCode = "red" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Blue", ColorCode = "blue" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Magenta", ColorCode = "magenta" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Cobalt", ColorCode = "darkCobalt" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Emerald", ColorCode = "emerald" });
            db.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Mauve", ColorCode = "mauve" });
            db.SaveChanges();


            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("created");
            activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
            activity.SetObject("board", board.BoardId.ToString(), board.Name, String.Format(@"/board/{0}", board.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> created new board <a href=""{2}"">{3}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName
                ));
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<Board>(board, db, activity: activity);

        }

        
    }
}
