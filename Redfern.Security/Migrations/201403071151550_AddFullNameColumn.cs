namespace Redfern.Security.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFullNameColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "FullName", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "FullName");
        }
    }
}
