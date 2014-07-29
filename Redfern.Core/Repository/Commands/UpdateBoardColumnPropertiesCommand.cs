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
    public class UpdateBoardColumnPropertiesCommand : IRepositoryCommand<BoardColumn>
    {

        private bool _boardIdUpdated;
        private int _boardId;
        private bool _columnIdUpdated;
        private int _columnId;
        private bool _nameUpdated = false;
        private string _name;
        private bool _hiddenUpdated = false;
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

        public CommandResult<BoardColumn> Execute(RedfernDb db)
        {
            BoardColumn column = db.BoardColumns.Find(this._columnId);
            if (_nameUpdated) column.Name = this._name;
            if (_hiddenUpdated) column.Hidden = this._hidden;
            db.SaveChanges();

            Activity activity;
            if (_nameUpdated)
                activity = CreateUpdateColumnNameActivity(column, db);
            else if (_hiddenUpdated && this._hidden)
                activity = CreateHideColumnActivity(column, db);
            else if (_hiddenUpdated && !this._hidden)
                activity = CreateUnhidColumnActivity(column, db);
            else
                activity = CreateUpdateColumnPropertyActivity(column, db);
            
            return this.CommandResult<BoardColumn>(column, db, activity);

        }

        private Activity CreateUpdateColumnPropertyActivity(BoardColumn column, RedfernDb db)
        {
            Activity activity = db.CreateActivity();
            activity.SetVerb("updated");
            activity.SetObject("column", column.ColumnId.ToString(), column.Name, "");
            activity.SetContext("board", column.BoardId.ToString(), column.Board.Name, String.Format(@"/board/{0}", column.BoardId));
            activity.SetDescription("{actorlink} modified column {object} in board {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();
            return activity;
        }

        private Activity CreateUpdateColumnNameActivity(BoardColumn column, RedfernDb db)
        {
            Activity activity = db.CreateActivity();
            activity.SetVerb("renamed");
            activity.SetObject("column", column.ColumnId.ToString(), column.Name, "");
            activity.SetContext("board", column.BoardId.ToString(), column.Board.Name, String.Format(@"/board/{0}", column.BoardId));
            activity.SetDescription("{actorlink} renamed column {object} in board {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();
            return activity;
        }

        private Activity CreateHideColumnActivity(BoardColumn column, RedfernDb db)
        {
            Activity activity = db.CreateActivity();
            activity.SetVerb("hid");
            activity.SetObject("column", column.ColumnId.ToString(), column.Name, "");
            activity.SetContext("board", column.BoardId.ToString(), column.Board.Name, String.Format(@"/board/{0}", column.BoardId));
            activity.SetDescription("{actorlink} hid column {object} in board {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();
            return activity;
        }

        private Activity CreateUnhidColumnActivity(BoardColumn column, RedfernDb db)
        {
            Activity activity = db.CreateActivity();
            activity.SetVerb("unhid");
            activity.SetObject("column", column.ColumnId.ToString(), column.Name, "");
            activity.SetContext("board", column.BoardId.ToString(), column.Board.Name, String.Format(@"/board/{0}", column.BoardId));
            activity.SetDescription("{actorlink} unhid column {object} in board {contextlink}");
            activity = db.Activities.Add(activity);
            db.SaveChanges();
            return activity;
        }
    }
}
