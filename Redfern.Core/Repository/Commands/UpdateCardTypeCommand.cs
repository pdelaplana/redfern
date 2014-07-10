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
        
        public CardType Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            CardType cardType = db.CardTypes.Find(this._cardTypeId);
            if (_boardIdChanged)
                cardType.BoardId = this.BoardId;
            if (_nameChanged)
                cardType.Name = this.Name;
            if (_colorCodeChanged)
                cardType.ColorCode = this.ColorCode;
            db.SaveChanges();

            
            return cardType;
        }
    }
}
