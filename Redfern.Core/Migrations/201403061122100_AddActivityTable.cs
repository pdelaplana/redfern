namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddActivityTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Activities",
                c => new
                    {
                        ActivityId = c.Int(nullable: false, identity: true),
                        ActivityDate = c.DateTime(nullable: false),
                        Description = c.String(nullable: false, maxLength: 500),
                        Verb = c.String(maxLength: 20),
                        ActorId = c.String(maxLength: 20),
                        ActorDisplayName = c.String(maxLength: 50),
                        ActorType = c.String(maxLength: 20),
                        ActorUrl = c.String(maxLength: 100),
                        ActorImageUrl = c.String(maxLength: 100),
                        ObjectId = c.String(maxLength: 20),
                        ObjectDisplayName = c.String(maxLength: 50),
                        ObjectType = c.String(maxLength: 20),
                        ObjectUrl = c.String(maxLength: 100),
                        ObjectImageUrl = c.String(maxLength: 100),
                        TargetId = c.String(maxLength: 20),
                        TargetDisplayName = c.String(maxLength: 50),
                        TargetType = c.String(maxLength: 20),
                        TargetUrl = c.String(maxLength: 100),
                        TargetImageUrl = c.String(maxLength: 100),
                        ContextId = c.String(maxLength: 20),
                        ContextDisplayName = c.String(maxLength: 50),
                        ContextType = c.String(maxLength: 20),
                        ContextUrl = c.String(maxLength: 100),
                        ContextImageUrl = c.String(maxLength: 100),
                        AdditionalData = c.String(maxLength: 500),
                    })
                .PrimaryKey(t => t.ActivityId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Activities");
        }
    }
}
