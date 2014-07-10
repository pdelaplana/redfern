﻿using Redfern.Core.Cache;
using Redfern.Core.Models;
using Redfern.Security;

namespace Redfern.Core.Repository
{
    
    public interface IRepositoryCommand<T>
    {
        T Execute(RedfernDb db, IUserCache<RedfernUser> userCache);
    }


}
