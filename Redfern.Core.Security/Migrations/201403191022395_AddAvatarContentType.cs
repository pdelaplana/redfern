namespace Redfern.Core.Security.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAvatarContentType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "AvatarContentType", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "AvatarContentType");
        }
    }
}
