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
    public class UpdateCardTypeCommand : IRepositoryCommand<CardType>
    {
        private int _cardTypeId;

        private bool _boardIdChanged;
        private int _boardId;

        private bool _nameChanged;
        private string _name;

        private bool _colorCodeChanged;
        private string _colorCode;

        
        public int CardTypeId
        {
            get { return _cardTypeId; }
            set { _cardTypeId = value; }
        }
        public int BoardId 
        {
            get { return _boardId; }
            set { _boardIdChanged = true; _boardId = value; } 
        }
        public string Name 
        {
            get { return _name; }
            set { _nameChanged = true; _name= value; }
        }
        public string ColorCode
        {
            get { return _colorCode; }
            set { _colorCodeChanged = true; _colorCode = value; }
        }
        
        public CommandResult<CardType> Execute(RedfernDb db)
        {
            CardType cardType = db.CardTypes.Find(this._cardTypeId);
            if (_boardIdChanged)
                cardType.BoardId = this.BoardId;
            if (_nameChanged)
                cardType.Name = this.Name;
            if (_colorCodeChanged)
                cardType.ColorCode = this.ColorCode;
            db.SaveChanges();

            Activity activity = db.Activities.Create();
            activity.ActivityDate = DateTime.UtcNow;

            if (_nameChanged)
            {
                activity.SetVerb("renamed");
                activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
                activity.SetObject("color", cardType.ColorCode, cardType.ColorCode, "");
                activity.SetTarget("name", cardType.Name, cardType.Name, "");
                activity.SetContext("board", cardType.BoardId.ToString(), cardType.Board.Name, "");
                activity.SetDescription("{actorlink} renamed color {object} to {target} in {contextlink}");
            }
            else
            {
                activity.SetVerb("updated");
                activity.SetActor(db.Context.ClientUserName, db.Context.ClientUserFullName);
                activity.SetObject("cardtype", cardType.CardTypeId.ToString(), cardType.Name, "");
                activity.SetContext("board", cardType.BoardId.ToString(), cardType.Board.Name, "");
                activity.SetDescription("{actorlink} updated cardtype {objectlink} in {contextlink}");

            }

           
            activity = db.Activities.Add(activity);
            db.SaveChanges();

            return this.CommandResult<CardType>(cardType, db, activity);
            
        }
    }
}
