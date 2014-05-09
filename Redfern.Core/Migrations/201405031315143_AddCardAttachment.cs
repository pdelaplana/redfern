namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCardAttachment : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CardAttachments",
                c => new
                    {
                        CardAttachmentId = c.Int(nullable: false, identity: true),
                        CardId = c.Int(nullable: false),
                        FileName = c.String(maxLength: 50),
                        FileExtension = c.String(maxLength: 5),
                        ContentType = c.String(maxLength: 20),
                        FileContent = c.Binary(),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CardAttachmentId)
                .ForeignKey("dbo.Cards", t => t.CardId, cascadeDelete: true)
                .Index(t => t.CardId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CardAttachments", "CardId", "dbo.Cards");
            DropIndex("dbo.CardAttachments", new[] { "CardId" });
            DropTable("dbo.CardAttachments");
        }
    }
}
