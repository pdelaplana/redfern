namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IncreaseCommentMaxLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CardComments", "Comment", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CardComments", "Comment", c => c.String(maxLength: 250));
        }
    }
}
