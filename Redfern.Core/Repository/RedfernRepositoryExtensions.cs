using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Repository
{
    public static class  RedfernRepositoryExtensions
    {
        public static IList<Board> OfUser(this IQueryable<Board> source, string userName)
        {
            return source.Where(b => b.Owner == userName || b.Members.Where(m => m.UserName == userName).Count() > 0).ToList();
        }

        public static IQueryable<Activity> OfBoard(this IQueryable<Activity> source, int boardId)
        {
            string idAsString = boardId.ToString();
            return source.Where(a => (a.ObjectType == "board" && a.ObjectId == idAsString) || (a.ContextType == "board" && a.ContextId == idAsString)).OrderByDescending(a => a.ActivityDate);
        }
    }
}
