using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Helpers;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Redfern.Core.Models;
using Redfern.Core.Repository;
using Redfern.Core.Repository.Commands;
using Redfern.Web.API.Binders;
using Redfern.Web.API.DTO;
using Redfern.Web.Models;

namespace Redfern.Web.API
{
    [RoutePrefix("api/card/{cardId:int}/attachments")]
    [Authorize]
    public class CardAttachmentController : ApiController
    {

        public IRedfernRepository _repository;

        public CardAttachmentController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/card/1/attachments
        [Route("")]
        public IEnumerable<CardAttachmentListItem> GetAttachments(int cardid)
        {
            var card = this._repository.Get<Card>(cardid);
            return AutoMapper.Mapper.Map<IList<CardAttachment>, IList<CardAttachmentListItem>>(card.Attachments.OrderByDescending(a => a.CreatedDate).ToList());
            
        }

        // GET api/card/1/attachments/1/thumbnail
        [Route("{id:int}/thumbnail")]
        public HttpResponseMessage GetThumbnail(int id)
        {
            WebImage webImage;
            var attachment = this._repository.Get<CardAttachment>(id);

            if (attachment.ContentType.Split('/')[0] == "image")
            {
                webImage = new WebImage(attachment.FileContent)
                            .Resize(150, 150, false, true)
                            .Crop(1, 1);
            }
            else
            {
                webImage = new WebImage(HostingEnvironment.MapPath(@"~/content/images/grey-box.png"))
                            .Resize(100, 100, false, true)
                            .Crop(1, 1)
                            .AddTextWatermark(attachment.FileExtension.Substring(1).ToUpper(), fontColor:"White", horizontalAlign:"Center", verticalAlign:"Middle");
            }

            HttpResponseMessage response = new HttpResponseMessage();
            response.Content = new StreamContent(new MemoryStream(webImage.GetBytes())); // this file stream will be closed by lower layers of web api for you once the response is completed.
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(attachment.ContentType);
            return response;

        }

        // GET api/card/1/attachments/1/image
        [Route("{id:int}/image")]
        public HttpResponseMessage GetImage(int id, int height = 150, int width = 150)
        {
            WebImage webImage;
            var attachment = this._repository.Get<CardAttachment>(id);

            if (attachment.ContentType.Split('/')[0] == "image")
            {
                webImage = new WebImage(attachment.FileContent)
                            //.Resize(height, width, false, true)
                            .Crop(1, 1);
            }
            else
            {
                webImage = new WebImage(HostingEnvironment.MapPath(@"~/content/images/grey-box.png"))
                            .Resize(100, 100, false, true)
                            .Crop(1, 1)
                            .AddTextWatermark(attachment.FileExtension.Substring(1).ToUpper(), fontColor: "White", horizontalAlign: "Center", verticalAlign: "Middle");
            }

            HttpResponseMessage response = new HttpResponseMessage();
            response.Content = new StreamContent(new MemoryStream(webImage.GetBytes())); // this file stream will be closed by lower layers of web api for you once the response is completed.
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(attachment.ContentType);
            return response;

        }


        // GET api/card/1/attachments/at
        [Route("{id:int}")]
        public HttpResponseMessage GetAttachment(int id)
        {
            HttpResponseMessage response = null;
            var attachment = _repository.CardAttachments.Where(a => a.CardAttachmentId == id).SingleOrDefault();
            if (attachment == null)
            {
                response = Request.CreateResponse(HttpStatusCode.NotFound);
            }
            else
            {
                response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(attachment.FileContent);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = attachment.FileName;
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(attachment.ContentType);
            }
            return response;

        }

        // POST api/card/1/attachments
        [Route("")]
        public WebApiResult<CardAttachmentListItem> Post(int cardId, [ModelBinder(typeof(FileUploadDTOModelBinder))]FileUploadDTO dto)
        {
            var result = _repository.ExecuteCommand(new AddCardAttachmentCommand
            {
                CardId = cardId,
                ContentType = dto.ContentType,
                FileContent = dto.Contents,
                FileName =  dto.FileName.Length > 49 ? dto.FileName.Substring(0,46) + dto.FileExtension : dto.FileName,
                FileExtension = dto.FileExtension
            });
            return AutoMapper.Mapper.Map<CommandResult<CardAttachment>, WebApiResult<CardAttachmentListItem>>(result);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }


        // DELETE api/cardattachment/5
        [Route("{id:int}")]
        public WebApiResult<bool>  Delete(int id)
        {
            var result = _repository.ExecuteCommand(new DeleteCardAttachmentCommand { CardAttachmentId = id });
            return AutoMapper.Mapper.Map<CommandResult<bool>, WebApiResult<bool>>(result);
        }
    }
}