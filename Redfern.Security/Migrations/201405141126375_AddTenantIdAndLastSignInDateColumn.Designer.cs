// <auto-generated />
namespace Redfern.Security.Migrations
{
    using System.CodeDom.Compiler;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Migrations.Infrastructure;
    using System.Resources;
    
    [GeneratedCode("EntityFramework.Migrations", "6.1.0-30225")]
    public sealed partial class AddTenantIdAndLastSignInDateColumn : IMigrationMetadata
    {
        private readonly ResourceManager Resources = new ResourceManager(typeof(AddTenantIdAndLastSignInDateColumn));
        
        string IMigrationMetadata.Id
        {
            get { return "201405141126375_AddTenantIdAndLastSignInDateColumn"; }
        }
        
        string IMigrationMetadata.Source
        {
            get { return null; }
        }
        
        string IMigrationMetadata.Target
        {
            get { return Resources.GetString("Target"); }
        }
    }
}
