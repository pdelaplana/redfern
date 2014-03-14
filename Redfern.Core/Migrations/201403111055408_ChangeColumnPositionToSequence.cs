namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeColumnPositionToSequence : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cards", "Sequence", c => c.Int(nullable: false));
            DropColumn("dbo.Cards", "ColumnPosition");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Cards", "ColumnPosition", c => c.Int(nullable: false));
            DropColumn("dbo.Cards", "Sequence");
        }
    }
}
