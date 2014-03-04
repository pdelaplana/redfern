namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Boards",
                c => new
                    {
                        BoardId = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                        ArchiveDate = c.DateTime(),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.BoardId);
            
            CreateTable(
                "dbo.Cards",
                c => new
                    {
                        CardId = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false, maxLength: 100),
                        Description = c.String(),
                        BoardId = c.Int(nullable: false),
                        ColumnId = c.Int(nullable: false),
                        ColumnPosition = c.Int(nullable: false),
                        AssignedToUser = c.String(maxLength: 20),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CardId)
                .ForeignKey("dbo.Boards", t => t.BoardId)
                .ForeignKey("dbo.BoardColumns", t => t.ColumnId)
                .Index(t => t.BoardId)
                .Index(t => t.ColumnId);
            
            CreateTable(
                "dbo.BoardColumns",
                c => new
                    {
                        ColumnId = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 30),
                        BoardId = c.Int(nullable: false),
                        Sequence = c.Int(nullable: false),
                        Expanded = c.Boolean(nullable: false),
                        Hidden = c.Boolean(nullable: false),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ColumnId)
                .ForeignKey("dbo.Boards", t => t.BoardId)
                .Index(t => t.BoardId);
            
            CreateTable(
                "dbo.CardComments",
                c => new
                    {
                        CommentId = c.Int(nullable: false, identity: true),
                        CardId = c.Int(nullable: false),
                        Comment = c.String(maxLength: 250),
                        CommentByUser = c.String(maxLength: 20),
                        CommentDate = c.DateTime(nullable: false),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CommentId)
                .ForeignKey("dbo.Cards", t => t.CardId, cascadeDelete: true)
                .Index(t => t.CardId);
            
            CreateTable(
                "dbo.CardTags",
                c => new
                    {
                        CardTagId = c.Int(nullable: false, identity: true),
                        CardId = c.Int(nullable: false),
                        TagId = c.Int(nullable: false),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CardTagId)
                .ForeignKey("dbo.Cards", t => t.CardId, cascadeDelete: true)
                .ForeignKey("dbo.Tags", t => t.TagId)
                .Index(t => t.CardId)
                .Index(t => t.TagId);
            
            CreateTable(
                "dbo.Tags",
                c => new
                    {
                        TagId = c.Int(nullable: false, identity: true),
                        TagName = c.String(maxLength: 20),
                        Color = c.String(maxLength: 20),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TagId);
            
            CreateTable(
                "dbo.CardTasks",
                c => new
                    {
                        CardTaskId = c.Int(nullable: false, identity: true),
                        CardId = c.Int(nullable: false),
                        Description = c.String(nullable: false, maxLength: 110),
                        CompletedDate = c.DateTime(),
                        CompletedByUser = c.String(maxLength: 20),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CardTaskId)
                .ForeignKey("dbo.Cards", t => t.CardId, cascadeDelete: true)
                .Index(t => t.CardId);
            
            CreateTable(
                "dbo.BoardMembers",
                c => new
                    {
                        BoardMemberId = c.Int(nullable: false, identity: true),
                        BoardId = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 20),
                        Role = c.Int(nullable: false),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.BoardMemberId)
                .ForeignKey("dbo.Boards", t => t.BoardId, cascadeDelete: true)
                .Index(t => t.BoardId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BoardMembers", "BoardId", "dbo.Boards");
            DropForeignKey("dbo.CardTasks", "CardId", "dbo.Cards");
            DropForeignKey("dbo.CardTags", "TagId", "dbo.Tags");
            DropForeignKey("dbo.CardTags", "CardId", "dbo.Cards");
            DropForeignKey("dbo.CardComments", "CardId", "dbo.Cards");
            DropForeignKey("dbo.Cards", "ColumnId", "dbo.BoardColumns");
            DropForeignKey("dbo.BoardColumns", "BoardId", "dbo.Boards");
            DropForeignKey("dbo.Cards", "BoardId", "dbo.Boards");
            DropIndex("dbo.BoardMembers", new[] { "BoardId" });
            DropIndex("dbo.CardTasks", new[] { "CardId" });
            DropIndex("dbo.CardTags", new[] { "TagId" });
            DropIndex("dbo.CardTags", new[] { "CardId" });
            DropIndex("dbo.CardComments", new[] { "CardId" });
            DropIndex("dbo.Cards", new[] { "ColumnId" });
            DropIndex("dbo.BoardColumns", new[] { "BoardId" });
            DropIndex("dbo.Cards", new[] { "BoardId" });
            DropTable("dbo.BoardMembers");
            DropTable("dbo.CardTasks");
            DropTable("dbo.Tags");
            DropTable("dbo.CardTags");
            DropTable("dbo.CardComments");
            DropTable("dbo.BoardColumns");
            DropTable("dbo.Cards");
            DropTable("dbo.Boards");
        }
    }
}
