using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;

namespace Redfern.Core.Security
{
    public class RedfernUserManager : UserManager<RedfernUser>
    {
        public RedfernUserManager(IUserStore<RedfernUser> store)
            : base(store)
        {
        }


        public static RedfernUserManager Create(IdentityFactoryOptions<RedfernUserManager> options, IOwinContext context)
        {
            var manager = new RedfernUserManager(new UserStore<RedfernUser>(context.Get<RedfernSecurityContext>()));
            //var manager = new RedfernUserManager(new UserStore<RedfernUser>(new RedfernSecurityContext()));
            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<RedfernUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true
            };
            // Configure user lockout defaults
            manager.UserLockoutEnabledByDefault = true;
            manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            manager.MaxFailedAccessAttemptsBeforeLockout = 5;
            // Register two factor authentication providers. This application uses Phone and Emails as a step of receiving a code for verifying the user
            // You can write your own provider and plug in here.
            manager.RegisterTwoFactorProvider("PhoneCode", new PhoneNumberTokenProvider<RedfernUser>
            {
                MessageFormat = "Your security code is: {0}"
            });
            manager.RegisterTwoFactorProvider("EmailCode", new EmailTokenProvider<RedfernUser>
            {
                Subject = "SecurityCode",
                BodyFormat = "Your security code is {0}"
            });
            manager.EmailService = new EmailService();
            manager.SmsService = new SmsService();

            //var provider = new Microsoft.Owin.Security.DataProtection.DpapiDataProtectionProvider("Sample");
            //manager.UserTokenProvider = new Microsoft.AspNet.Identity.Owin.DataProtectorTokenProvider<RedfernUser>(provider.Create("EmailConfirmation"));
            
            var dataProtectionProvider = options.DataProtectionProvider;

            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<RedfernUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            
            return manager;
        }

        
    }

    public class EmailService : IIdentityMessageService
    {
        public async Task SendAsync(IdentityMessage message)
        {
            // Create the mail message
            var mailMessage = new MailMessage(
                "no-reply@redfernapp.com",
                message.Destination,
                message.Subject,
                message.Body
                );

            // Send the message
            SmtpClient client = new SmtpClient();
            await client.SendMailAsync(mailMessage);

            //return Task.FromResult(true);

            
        }
    }

    public class SmsService : IIdentityMessageService
    {
        public Task SendAsync(IdentityMessage message)
        {
            // Plug in your sms service here to send a text message.
            return Task.FromResult(0);
        }
    }


}
