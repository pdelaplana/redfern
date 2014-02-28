using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Livefrog.Commons.Repositories;

namespace Redfern.Core
{
    public class RedfernContext : IRepositoryContext
    {

        public string ClientUserName
        {
            get;
            set;
        }

        public string ClientIpAddress
        {
            get;
            set;
        }

        public TimeZoneInfo ClientTimeZone
        {
            get;
            set;
        }

        public int TenantID
        {
            get;
            set;
        }

        public string DbServer
        {
            get;
            set;
        }

        public string DbName
        {
            get;
            set;
        }

        public string DbUser
        {
            get;
            set;
        }

        public string DbPassword
        {
            get;
            set;
        }

        public string Metadata
        {
            get;
            set;
        }
    }
}
