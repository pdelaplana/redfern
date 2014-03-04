using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Models.Configuration
{
    class BoardColumnConfiguration : EntityTypeConfiguration<BoardColumn>
    {
        internal BoardColumnConfiguration()
        {
            HasRequired(c => c.Board)
                .WithMany(b => b.Columns)
                .HasForeignKey(c => c.BoardId)
                .WillCascadeOnDelete(false);
        }
    }
}
