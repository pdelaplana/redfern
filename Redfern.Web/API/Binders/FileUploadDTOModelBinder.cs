using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Redfern.Web.API.DTO;
using Redfern.Web.API.Providers;

namespace Redfern.Web.API.Binders
{
    public class FileUploadDTOModelBinder : IModelBinder
    {

        public bool BindModel(System.Web.Http.Controllers.HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            var request = actionContext.Request;
            if (request.Content.IsMimeMultipartContent())
            {
                InMemoryMultipartFormDataStreamProvider streamProvider = new InMemoryMultipartFormDataStreamProvider();
                FileUploadDTO dto = new FileUploadDTO();

                var task = Task.Run(async() => {
                    await request.Content.ReadAsMultipartAsync(streamProvider).ContinueWith(t=>
                    {
                        if (t.IsFaulted || t.IsCanceled)
                            throw new HttpResponseException(HttpStatusCode.InternalServerError);

                        
                        foreach (var i in streamProvider.Files)
                        {
                            dto.FileName = Path.GetFileName(i.Headers.ContentDisposition.FileName.Replace("\"", String.Empty));
                            if (String.IsNullOrEmpty(dto.Title))
                                dto.Title = Path.GetFileNameWithoutExtension(dto.FileName);
                            dto.ContentType = HttpUtility.HtmlDecode(i.Headers.ContentType.MediaType);
                            dto.Contents = new byte[(int)i.Headers.ContentLength];
                            Stream stream = i.ReadAsStreamAsync().Result;
                            stream.Read(dto.Contents, 0, (int)i.Headers.ContentLength);
                        }                        
                    });
                });
                task.Wait();

                bindingContext.Model = dto;
                
                return true;
            }
            else
                throw new HttpResponseException(request.CreateResponse(HttpStatusCode.NotAcceptable, "This request is not properly formatted"));
        }


        private int TryParseToInt(string value)
        {
            int intValue = 0;
            return Int32.TryParse(value, out intValue) ? intValue : 0;
        }

        private int? TryParseToNullableInt(string value)
        {
            int intValue = 0;
            return Int32.TryParse(value, out intValue) ? (int?)intValue : null;
        }

        private DateTime? TryParseToDateTime(string value)
        {
            DateTime dateTimeValue;
            return DateTime.TryParse(value, out dateTimeValue) ? (DateTime?)dateTimeValue : null;
        }
        
    }
}