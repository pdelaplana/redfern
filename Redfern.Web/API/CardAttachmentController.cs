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
    public class CardAttachmentController : ApiController
    {

        public IRedfernRepository _repository;

        public CardAttachmentController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/cardattachment/?cardid=1
        public IEnumerable<CardAttachmentListItem> GetAttachments(int cardid)
        {
            var card = this._repository.Get<Card>(cardid);
            return AutoMapper.Mapper.Map<IList<CardAttachment>, IList<CardAttachmentListItem>>(card.Attachments.OrderByDescending(a => a.CreatedDate).ToList());
            
        }

        // GET api/cardattachment/?cardid=1
        public HttpResponseMessage GetThumbnail(int thumbid)
        {
            WebImage webImage;
            var attachment = this._repository.Get<CardAttachment>(thumbid);

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


        // GET api/cardattachment
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

        // POST api/cardattachment
        public CardAttachmentListItem Post(int id, [ModelBinder(typeof(FileUploadDTOModelBinder))]FileUploadDTO dto)
        {
            var attachment = _repository.ExecuteCommand(new AddCardAttachmentCommand
            {
                CardId = id,
                ContentType = dto.ContentType,
                FileContent = dto.Contents,
                FileName =  dto.FileName.Length > 49 ? dto.FileName.Substring(0,46) + dto.FileExtension : dto.FileName,
                FileExtension = dto.FileExtension
            });
            return AutoMapper.Mapper.Map<CardAttachment, CardAttachmentListItem>(attachment);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/cardattachment/5
        public void Delete(int id)
        {
            _repository.ExecuteCommand(new DeleteCardAttachmentCommand { CardAttachmentId = id });
        }
    }
}