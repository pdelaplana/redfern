namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddArchivedDateToCard : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cards", "ArchivedDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Cards", "ArchivedDate");
        }
    }
}
