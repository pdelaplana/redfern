namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDueDateFieldInCard : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cards", "DueDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Cards", "DueDate");
        }
    }
}
