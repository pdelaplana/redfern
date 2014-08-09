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
using Redfern.Core.Models;
using Redfern.Core.Repository;

namespace Redfern.Web.API
{
    [Authorize]
    public class FileController : ApiController
    {
        public IRedfernRepository _repository;

        public FileController(IRedfernRepository repository)
        {
            _repository = repository;
        }

        // GET api/file/1
        [Route("api/file/{id:int}")]
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

        // GET api/image/1
        [Route("api/image/{id:int}")]
        public HttpResponseMessage GetImage(int id, int height = 150, int width = 150)
        {
            WebImage webImage;
            HttpResponseMessage response;
            var attachment = this._repository.Get<CardAttachment>(id);

            if (attachment == null)
            {
                webImage = new WebImage(HostingEnvironment.MapPath(@"~/content/images/grey-box.png"))
                            .Resize(100, 100, false, true)
                            .Crop(1, 1)
                            .AddTextWatermark("Not found", fontColor: "White", horizontalAlign: "Center", verticalAlign: "Middle");

                response = new HttpResponseMessage();
                response.Content = new StreamContent(new MemoryStream(webImage.GetBytes())); // this file stream will be closed by lower layers of web api for you once the response is completed.
                //response.Content.Headers.ContentType = new MediaTypeHeaderValue(attachment.ContentType);
                return response;
            }
            
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

            response = new HttpResponseMessage();
            response.Content = new StreamContent(new MemoryStream(webImage.GetBytes())); // this file stream will be closed by lower layers of web api for you once the response is completed.
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(attachment.ContentType);
            return response;

        }

        // GET api/card/1/attachments/1/thumbnail
        [Route("api/thumbnail/{id:int}")]
        public HttpResponseMessage GetThumbnail(int id)
        {
            WebImage webImage;
            var attachment = this._repository.Get<CardAttachment>(id);

            if (attachment.ContentType.Split('/')[0] == "image")
            {
                webImage = new WebImage(attachment.FileContent)
                            .Resize(80, 80, false, true)
                            .Crop(1, 1);
            }
            else
            {
                webImage = new WebImage(HostingEnvironment.MapPath(@"~/content/images/grey-box.png"))
                            .Resize(80, 80, false, true)
                            .Crop(1, 1)
                            .AddTextWatermark(attachment.FileExtension.Substring(1).ToUpper(), fontColor: "White", horizontalAlign: "Center", verticalAlign: "Middle");
            }

            HttpResponseMessage response = new HttpResponseMessage();
            response.Content = new StreamContent(new MemoryStream(webImage.GetBytes())); // this file stream will be closed by lower layers of web api for you once the response is completed.
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(attachment.ContentType);
            return response;

        }

    }
}
