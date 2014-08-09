namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IncreaseAddtionalDataToMaxLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Activities", "AdditionalData", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Activities", "AdditionalData", c => c.String(maxLength: 500));
        }
    }
}
