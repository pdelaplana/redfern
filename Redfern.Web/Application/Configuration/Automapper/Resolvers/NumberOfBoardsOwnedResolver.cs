using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Redfern.Core.Repository;

namespace Redfern.Web.Application.Configuration.Automapper.Resolvers
{
    public class NumberOfBoardsOwnedResolver : ValueResolver<string, int>
    {
        private IRedfernRepository _repository { get; set; }

        public NumberOfBoardsOwnedResolver(IRedfernRepository repository)
        {
            _repository = repository;
        }

        protected override int ResolveCore(string source)
        {
            return _repository.Boards.Count(b => b.Owner == source);
        }
    }
}