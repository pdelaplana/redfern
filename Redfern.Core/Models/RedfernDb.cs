﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Redfern.Core;
using Redfern.Core.Models.Configuration;
using Redfern.Core.Security;


namespace Redfern.Core.Models
{
    public class RedfernDb : DbContext
    {
        private RedfernContext _context;

        private UserManager<RedfernUser> _userManager = RedfernSecurityContext.CreateUserManager();

        public static string CreateConnectionString(RedfernContext context)
        {
            return new SqlConnectionStringBuilder
            {
                DataSource = context.DbServer,
                InitialCatalog = context.DbName,
                UserID = context.DbUser,
                Password = context.DbPassword,
                PersistSecurityInfo = true,
                ApplicationName = "Redfern",
            }.ConnectionString;

        }

        public RedfernDb(RedfernContext context) : base(RedfernDb.CreateConnectionString(context))
        {
            this._context = context;
            this.Configuration.LazyLoadingEnabled = true;
            this.Configuration.ProxyCreationEnabled = true;

        }

        public RedfernDb() : base("Name=RedfernDbConnection") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new BoardColumnConfiguration());
            modelBuilder.Configurations.Add(new CardConfiguration());
            modelBuilder.Configurations.Add(new CardTagConfiguration());
        }

        public override int SaveChanges()
        {
            var utcDate = DateTime.UtcNow;
            var changeSet = ChangeTracker.Entries<Auditable>();
            if (changeSet != null)
            {

                foreach (DbEntityEntry<Auditable> entry in changeSet)
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            entry.Entity.TenantId = _context.TenantID;
                            entry.Entity.CreatedByUser = _context.ClientUserName;
                            entry.Entity.CreatedDate = utcDate;
                            entry.Entity.ModifiedByUser = _context.ClientUserName;
                            entry.Entity.ModifiedDate = utcDate;
                            break;
                        case EntityState.Modified:
                            entry.Entity.ModifiedByUser = _context.ClientUserName;
                            entry.Entity.ModifiedDate = utcDate;
                            break;
                    }
                }
            }
            return base.SaveChanges();
        }

        public RedfernContext Context { get { return _context; } }

        public UserManager<RedfernUser> UserManager { get { return _userManager;  }}

        public DbSet<Board> Boards { get; set; }
        
        public DbSet<Card> Cards { get; set; }

        public DbSet<Tag> Tags { get; set; }

    }
}