namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsPublicToBoard : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Boards", "IsPublic", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Boards", "IsPublic");
        }
    }
}
