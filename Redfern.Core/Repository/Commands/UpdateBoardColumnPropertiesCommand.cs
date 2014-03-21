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
    public class UpdateBoardColumnPropertiesCommand : IRepositoryCommand<BoardColumn>
    {

        private bool _boardIdUpdated;
        private int _boardId;
        private bool _columnIdUpdated;
        private int _columnId;
        private bool _nameUpdated;
        private string _name;
        private bool _hiddenUpdated;
        private bool _hidden;

        public int BoardId 
        {
            get { return _boardId; }
            set { _boardIdUpdated = true; _boardId = value; }
        }
        public int ColumnId 
        {
            get { return _columnId;  }
            set { _columnIdUpdated = true; _columnId = value; }
        }
        public string Name 
        {
            get { return _name; }
            set { _nameUpdated = true; _name = value; }
        }

        public bool Hidden
        {
            get { return _hidden; }
            set { _hiddenUpdated = true; _hidden = value; }
        }

        public BoardColumn Execute(RedfernDb db, IUserCache<RedfernUser> userCache)
        {
            BoardColumn column = db.BoardColumns.Find(this._columnId);
            if (_nameUpdated) column.Name = this._name;
            if (_hiddenUpdated) column.Hidden = this._hidden;

       
            db.SaveChanges();

            return column;
        }
    }
}
