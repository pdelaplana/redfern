namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Redfern.Core.Models;

    public sealed class Configuration : DbMigrationsConfiguration<Redfern.Core.Models.RedfernDb>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            
        }

        protected override void Seed(Redfern.Core.Models.RedfernDb context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
     
            SeedCardTypes(context);
            
        }

        private void SeedCardTypes(Redfern.Core.Models.RedfernDb context)
        {
            

            foreach (var board in context.Boards.ToList())
            {
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Amber", ColorCode = "amber", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Yellow", ColorCode = "yellow", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Red", ColorCode = "red", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Blue", ColorCode = "blue", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Magenta", ColorCode = "magenta", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Cobalt", ColorCode = "darkCobalt", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Emerald", ColorCode = "emerald", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                context.CardTypes.Add(new CardType { BoardId = board.BoardId, Name = "Mauve", ColorCode = "mauve", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow });
                
                /*
                context.CardTypes.AddOrUpdate(
                    new CardType { BoardId = board.BoardId, Name = "Amber", ColorCode = "amber", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow  },
                    new CardType { BoardId = board.BoardId, Name = "Yellow", ColorCode = "yellow", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow  },
                    new CardType { BoardId = board.BoardId, Name = "Red", ColorCode = "red", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow },
                    new CardType { BoardId = board.BoardId, Name = "Blue", ColorCode = "blue", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow },
                    new CardType { BoardId = board.BoardId, Name = "Magenta", ColorCode = "magenta", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow },
                    new CardType { BoardId = board.BoardId, Name = "Cobalt", ColorCode = "darkCobalt", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow },
                    new CardType { BoardId = board.BoardId, Name = "Emerald", ColorCode = "emerald", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow },
                    new CardType { BoardId = board.BoardId, Name = "Mauve", ColorCode = "mauve", TenantId = board.TenantId, CreatedByUser = "migration", CreatedDate = DateTime.UtcNow, ModifiedByUser = "migration", ModifiedDate = DateTime.UtcNow }
                    );
                 */
            }
            context.SaveChanges();

            foreach (var card in context.Cards.Where(c => c.CardTypeId == null).ToList())
            {
                var cardType = card.Board.CardTypes.Where(ct => ct.ColorCode == "amber").FirstOrDefault();
                card.CardTypeId = cardType != null ? cardType.CardTypeId : 1;
            }
            context.SaveChanges();
        }
    }
}
