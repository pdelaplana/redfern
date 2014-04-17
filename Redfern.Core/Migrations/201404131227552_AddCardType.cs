namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCardType : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CardTypes",
                c => new
                    {
                        CardTypeId = c.Int(nullable: false, identity: true),
                        BoardId = c.Int(nullable: false),
                        Name = c.String(nullable: false),
                        ColorCode = c.String(nullable: false),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CardTypeId)
                .ForeignKey("dbo.Boards", t => t.BoardId, cascadeDelete: true)
                .Index(t => t.BoardId);
            
            AddColumn("dbo.Cards", "CardTypeId", c => c.Int());
            CreateIndex("dbo.Cards", "CardTypeId");
            AddForeignKey("dbo.Cards", "CardTypeId", "dbo.CardTypes", "CardTypeId");

            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Cards", "CardTypeId", "dbo.CardTypes");
            DropForeignKey("dbo.CardTypes", "BoardId", "dbo.Boards");
            DropIndex("dbo.Cards", new[] { "CardTypeId" });
            DropIndex("dbo.CardTypes", new[] { "BoardId" });
            DropColumn("dbo.Cards", "CardTypeId");
            DropTable("dbo.CardTypes");
        }
    }
}
