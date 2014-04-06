namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOwnerToBoard : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Boards", "Owner", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Boards", "Owner");
        }
    }
}
