using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
using Redfern.Web.Models;


namespace Redfern.Web.API
{
    [RoutePrefix("api/notification")]
    [Authorize]
    public class NotificationController : ApiController
    {
        private IRedfernRepository _repository;

        public NotificationController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/notification/user
        [Route("{user}")]
        public IList<NotificationViewModel> Get(string user) 
        {
            return AutoMapper.Mapper.Map<IList<Notification>, IList<NotificationViewModel>>(_repository.Notifications.Where(n => n.RecipientUser == user && !n.ReadDate.HasValue).ToList());
        }


        // DELETE api/notification/1
        [Route("{id:int}")]
        public WebApiResult<bool> Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteNotificationCommand { NotificationId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }


    }
}
