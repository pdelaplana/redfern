namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeOwnerRequired : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Boards", "Owner", c => c.String(nullable: false, maxLength: 20));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Boards", "Owner", c => c.String(maxLength: 20));
        }
    }
}
