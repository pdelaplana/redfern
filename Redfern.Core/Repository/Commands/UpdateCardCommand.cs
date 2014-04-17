using System;
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
    public class UpdateCardCommand : IRepositoryCommand<Card>
    {
        private int _cardId;

        private bool _boardIdChanged;
        private int _boardId;

        private bool _columnIdChanged;
        private int _columnId;

        private bool _titleChanged;
        private string _title;

        private bool _cardTypeIdChanged;
        private int  _cardTypeId;

        private bool _descriptionChanged;
        private string _description;

        private bool _assignedToUserChanged;
        private string _assignedToUser;

        private bool _dueDateChanged;
        private DateTime? _dueDate;


        public int CardId
        {
            get { return _cardId; }
            set { _cardId = value; }
        }
        public int BoardId 
        {
            get { return _boardId; }
            set { _boardIdChanged = true; _boardId = value; } 
        }
        public int ColumnId 
        {
            get { return _columnId; }
            set { _columnIdChanged = true; _columnId = value; }
        }
        public string Title 
        {
            get { return _title; }
            set { _titleChanged = true; _title = value; }
        }
        public int CardTypeId
        {
            get { return _cardTypeId; }
            set { _cardTypeIdChanged = true; _cardTypeId= value; }
        }
        public string Description
        {
            get { return _description; }
            set { _descriptionChanged = true; _description = value; }
        }
        public string AssignedToUser
        {
            get { return _assignedToUser; }
            set { _assignedToUserChanged = true; _assignedToUser = value; }
        }
        public DateTime? DueDate
        {
            get { return _dueDate; }
            set { _dueDateChanged = true; _dueDate = value; }
        }
        

        public Card Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            Card card = db.Cards.Find(this._cardId);
            if (_boardIdChanged)
                card.BoardId = this.BoardId;
            if (_columnIdChanged)
                card.ColumnId = this.ColumnId;
            if (_titleChanged)
                card.Title= this.Title;
            if (_descriptionChanged)
                card.Description = this.Description;
            if (_cardTypeIdChanged)
                card.CardTypeId = this.CardTypeId;
            if (_assignedToUserChanged)
                card.AssignedToUser = this.AssignedToUser;
            if (_dueDateChanged)
                card.DueDate = this.DueDate;

            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;
            activity.SetVerb("update");
            activity.SetActor(db.Context.ClientUserName, userCache.GetFullName(db.Context.ClientUserName));
            activity.SetObject("card", card.CardId.ToString(), card.Title, String.Format(@"/board/{0}/card/{1}", card.BoardId, card.CardId));
            activity.SetContext("board", card.BoardId.ToString(), card.Board.Name, String.Format(@"/board/{0}", card.BoardId));
            activity.SetDescription(String.Format(@"<a href=""{0}"">{1}</a> updated card <a href=""{2}"">{3}</a> in board <a href=""{4}"">{5}</a>.",
                    activity.ActorUrl,
                    activity.ActorDisplayName,
                    activity.ObjectUrl,
                    activity.ObjectDisplayName,
                    activity.ContextUrl,
                    activity.ContextDisplayName
                ));
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return card;
        }
    }
}
