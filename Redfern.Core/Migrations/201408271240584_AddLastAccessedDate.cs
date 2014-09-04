namespace Redfern.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLastAccessedDate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BoardMembers", "LastAccessedDate", c => c.DateTime());
            Sql("UPDATE dbo.BoardMembers SET Role = 1 WHERE dbo.BoardMembers.UserName <> (SELECT TOP 1 UserName FROM dbo.Boards WHERE dbo.Boards.BoardId = dbo.BoardMembers.BoardId)");
            Sql("INSERT INTO BoardMembers (BoardId, UserName, Role, TenantId, CreatedByUser, CreatedDate, ModifiedByUser, ModifiedDate) SELECT BoardId, Owner, 0, TenantId, CreatedByUser, CreatedDate, ModifiedByUser, ModifiedDate FROM dbo.Boards WHERE Boards.Owner not in (SELECT UserName FROM dbo.BoardMembers WHERE dbo.BoardMembers.BoardId = dbo.Boards.BoardId )");
        }
        
        public override void Down()
        {
            DropColumn("dbo.BoardMembers", "LastAccessedDate");
        }
    }
}
