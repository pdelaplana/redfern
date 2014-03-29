using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Redfern.Core.Security;
using Redfern.Web.API.Binders;
using Redfern.Web.API.DTO;

namespace Redfern.Web.API
{
    public class AvatarController : ApiController
    {
        
        private UserManager<RedfernUser> _userManager;

        private void CropImage(WebImage image)
        {
            var width = image.Width;
            var height = image.Height;

            if (width > height)
            {
                var leftRightCrop = (width - height) / 2;
                image.Crop(0, leftRightCrop, 0, leftRightCrop);
            }
            else if (height > width)
            {
                var topBottomCrop = (height - width) / 2;
                image.Crop(topBottomCrop, 0, topBottomCrop, 0);
            }

        }
        
        public AvatarController()
        {
            _userManager = new UserManager<RedfernUser>(new UserStore<RedfernUser>(new RedfernSecurityContext()));
        }
        
        // GET api/<controller>
        public HttpResponseMessage Get(string id, int width = 100, int height = 100)
        {
            string nopic = "~/content/images/_default-user-avatar.png";
            WebImage webimage;
            var user = _userManager.FindByName(id);
            var avatar = user.Avatar;
            var contentType = user.AvatarContentType;
            if (avatar != null)
            {
                webimage = new WebImage(avatar);
                webimage.Resize(width, height, true);
                CropImage(webimage);
            }
            else
            {
                webimage = new WebImage(nopic);
                contentType = "image/png";
                webimage.Resize(width, height, true);
                CropImage(webimage);
            }
            HttpResponseMessage response = new HttpResponseMessage();
            response.Content = new StreamContent(new MemoryStream(webimage.GetBytes())); // this file stream will be closed by lower layers of web api for you once the response is completed.
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            return response;

        }


        // PUT api/avatar/username      
        public void Put(string id, [ModelBinder(typeof(FileUploadDTOModelBinder))]FileUploadDTO dto)
        {
            var user = _userManager.FindByName(id);
            user.Avatar = dto.Contents;
            user.AvatarContentType = dto.ContentType;
            _userManager.Update(user);
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

     

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}