namespace Redfern.Core.Security.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSignupDateAndIsEnabledColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "SignupDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.AspNetUsers", "IsEnabled", c => c.Boolean(nullable: false));
            Sql("UPDATE ASPNETUSERS SET ISENABLED=1");
            Sql("UPDATE ASPNETUSERS SET SIGNUPDATE=GETUTCDATE()");

        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "IsEnabled");
            DropColumn("dbo.AspNetUsers", "SignupDate");
        }
    }
}
