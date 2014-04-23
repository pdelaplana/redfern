namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSourceAndAuditableToActivity : DbMigration
    {
        public override void Up()
        {
            // drop the activity table
            Sql("delete activities");
            AddColumn("dbo.Activities", "SourceId", c => c.String(maxLength: 20));
            AddColumn("dbo.Activities", "SourceDisplayName", c => c.String(maxLength: 50));
            AddColumn("dbo.Activities", "SourceType", c => c.String(maxLength: 20));
            AddColumn("dbo.Activities", "SourceUrl", c => c.String(maxLength: 100));
            AddColumn("dbo.Activities", "SourceImageUrl", c => c.String(maxLength: 100));
            AddColumn("dbo.Activities", "TenantId", c => c.Int(nullable: false));
            AddColumn("dbo.Activities", "CreatedByUser", c => c.String(nullable: false, maxLength: 20));
            AddColumn("dbo.Activities", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Activities", "ModifiedByUser", c => c.String(nullable: false, maxLength: 20));
            AddColumn("dbo.Activities", "ModifiedDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "ModifiedDate");
            DropColumn("dbo.Activities", "ModifiedByUser");
            DropColumn("dbo.Activities", "CreatedDate");
            DropColumn("dbo.Activities", "CreatedByUser");
            DropColumn("dbo.Activities", "TenantId");
            DropColumn("dbo.Activities", "SourceImageUrl");
            DropColumn("dbo.Activities", "SourceUrl");
            DropColumn("dbo.Activities", "SourceType");
            DropColumn("dbo.Activities", "SourceDisplayName");
            DropColumn("dbo.Activities", "SourceId");
        }
    }
}
