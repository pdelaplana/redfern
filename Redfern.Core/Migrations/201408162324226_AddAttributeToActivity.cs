namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAttributeToActivity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "Attribute", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "Attribute");
        }
    }
}
