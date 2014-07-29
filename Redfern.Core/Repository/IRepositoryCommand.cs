using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Security;

namespace Redfern.Core.Repository
{
       
    public interface IRepositoryCommand<T>
    {
        CommandResult<T> Execute(RedfernDb db);
    }


}
