namespace Redfern.Security.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEmailAndAvatar : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Email", c => c.String(maxLength: 100));
            AddColumn("dbo.AspNetUsers", "Avatar", c => c.Binary());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "Avatar");
            DropColumn("dbo.AspNetUsers", "Email");
        }
    }
}
