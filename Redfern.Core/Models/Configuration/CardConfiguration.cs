using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Models.Configuration
{
    class CardConfiguration : EntityTypeConfiguration<Card>
    {
        internal CardConfiguration()
        {
            HasRequired(c => c.Board)
                .WithMany(b => b.Cards)
                .HasForeignKey(c => c.BoardId)
                .WillCascadeOnDelete(false);

            HasRequired(c => c.Column)
                .WithMany(b => b.Cards)
                .HasForeignKey(c => c.ColumnId)
                .WillCascadeOnDelete(false);

        }
    }
}
