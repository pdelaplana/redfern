namespace Redfern.Core.Security.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeTenantIdColumnMandatory : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetUsers", "TenantId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AspNetUsers", "TenantId", c => c.Int());
        }
    }
}
