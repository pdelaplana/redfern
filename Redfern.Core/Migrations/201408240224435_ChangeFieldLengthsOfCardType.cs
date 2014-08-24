namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeFieldLengthsOfCardType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CardTypes", "Name", c => c.String(nullable: false, maxLength: 20));
            AlterColumn("dbo.CardTypes", "ColorCode", c => c.String(nullable: false, maxLength: 15));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CardTypes", "ColorCode", c => c.String(nullable: false));
            AlterColumn("dbo.CardTypes", "Name", c => c.String(nullable: false));
        }
    }
}
