namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IncreaseContentTypeLengthInCardAttachment : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CardAttachments", "ContentType", c => c.String(maxLength: 40));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CardAttachments", "ContentType", c => c.String(maxLength: 20));
        }
    }
}
