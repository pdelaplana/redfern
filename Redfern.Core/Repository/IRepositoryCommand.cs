using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Repository
{
    public interface IRepositoryCommand<T> where T: class
    {
        T Execute(RedfernDb db);
    }
}
