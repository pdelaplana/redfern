using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Redfern.Core.Models;

namespace Redfern.Core.Models.Configuration
{
    class CardTagConfiguration : EntityTypeConfiguration<CardTag>
    {
        internal CardTagConfiguration()
        {
            HasRequired(c => c.Tag)
                .WithMany()
                .HasForeignKey(c => c.TagId)
                .WillCascadeOnDelete(false);

            

        }
    }
}
