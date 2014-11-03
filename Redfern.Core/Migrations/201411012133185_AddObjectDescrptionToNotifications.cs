namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddObjectDescrptionToNotifications : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Notifications", "ObjectDescription", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Notifications", "ObjectDescription");
        }
    }
}
