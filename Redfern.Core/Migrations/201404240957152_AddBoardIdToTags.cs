namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBoardIdToTags : DbMigration
    {
        public override void Up()
        {
            Sql("DELETE CARDTAGS");
            Sql("DELETE TAGS");
            AddColumn("dbo.Tags", "BoardId", c => c.Int(nullable: false));
            CreateIndex("dbo.Tags", "BoardId");
            AddForeignKey("dbo.Tags", "BoardId", "dbo.Boards", "BoardId", cascadeDelete: true);
            DropColumn("dbo.Tags", "Color");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Tags", "Color", c => c.String(maxLength: 20));
            DropForeignKey("dbo.Tags", "BoardId", "dbo.Boards");
            DropIndex("dbo.Tags", new[] { "BoardId" });
            DropColumn("dbo.Tags", "BoardId");
        }
    }
}
