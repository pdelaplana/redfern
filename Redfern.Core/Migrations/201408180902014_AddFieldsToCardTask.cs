namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFieldsToCardTask : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CardTasks", "AssignedToUser", c => c.String(maxLength: 20));
            AddColumn("dbo.CardTasks", "AssignedDate", c => c.DateTime());
            AddColumn("dbo.CardTasks", "DueDate", c => c.DateTime());
            AddColumn("dbo.CardTasks", "TaskNotes", c => c.String());
            AlterColumn("dbo.CardTasks", "Description", c => c.String(nullable: false, maxLength: 200));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CardTasks", "Description", c => c.String(nullable: false, maxLength: 110));
            DropColumn("dbo.CardTasks", "TaskNotes");
            DropColumn("dbo.CardTasks", "DueDate");
            DropColumn("dbo.CardTasks", "AssignedDate");
            DropColumn("dbo.CardTasks", "AssignedToUser");
        }
    }
}
