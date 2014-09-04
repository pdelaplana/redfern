namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNotification : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Notifications",
                c => new
                    {
                        NotificationId = c.Int(nullable: false, identity: true),
                        NotificationDate = c.DateTime(nullable: false),
                        DaysToExpiry = c.Int(),
                        ReadDate = c.DateTime(),
                        SenderUser = c.String(nullable: false, maxLength: 20),
                        RecipientUser = c.String(nullable: false, maxLength: 20),
                        NotificationType = c.Int(nullable: false),
                        Message = c.String(nullable: false, maxLength: 150),
                        ObjectType = c.String(maxLength: 30),
                        ObjectId = c.String(maxLength: 30),
                        TenantId = c.Int(nullable: false),
                        CreatedByUser = c.String(nullable: false, maxLength: 20),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByUser = c.String(nullable: false, maxLength: 20),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.NotificationId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Notifications");
        }
    }
}
