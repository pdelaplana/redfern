namespace Redfern.Core.Security.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTenantIdAndLastSignInDateColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "TenantId", c => c.Int());
            AddColumn("dbo.AspNetUsers", "LastSignInDate", c => c.DateTime());

            Sql("UPDATE ASPNETUSERS SET TENANTID = 4");
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "LastSignInDate");
            DropColumn("dbo.AspNetUsers", "TenantId");
        }
    }
}
