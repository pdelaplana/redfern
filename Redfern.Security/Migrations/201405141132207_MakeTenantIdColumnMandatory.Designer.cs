// <auto-generated />
namespace Redfern.Security.Migrations
{
    using System.CodeDom.Compiler;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Migrations.Infrastructure;
    using System.Resources;
    
    [GeneratedCode("EntityFramework.Migrations", "6.1.0-30225")]
    public sealed partial class MakeTenantIdColumnMandatory : IMigrationMetadata
    {
        private readonly ResourceManager Resources = new ResourceManager(typeof(MakeTenantIdColumnMandatory));
        
        string IMigrationMetadata.Id
        {
            get { return "201405141132207_MakeTenantIdColumnMandatory"; }
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
