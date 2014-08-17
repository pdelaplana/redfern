namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IncreaseFieldLengthOfFileExtension : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CardAttachments", "FileExtension", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CardAttachments", "FileExtension", c => c.String(maxLength: 5));
        }
    }
}
