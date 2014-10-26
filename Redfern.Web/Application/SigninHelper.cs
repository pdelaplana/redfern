using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Redfern.Security;

namespace Redfern.Web.Application
{
    public enum RSignInStatus
    {
        Success,
        LockedOut,
        RequiresTwoFactorAuthentication,
        NotFound,
        Failure
    }

    public class SigninHelper
    {
        public SigninHelper(RedfernUserManager userManager, IAuthenticationManager authManager)
        {
            UserManager = userManager;
            AuthenticationManager = authManager;
        }

        public RedfernUserManager UserManager { get; private set; }
        public IAuthenticationManager AuthenticationManager { get; private set; }

        public async Task SignInAsync(RedfernUser user, bool isPersistent, bool rememberBrowser)
        {
            // Clear any partial cookies from external or two factor partial sign ins
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie, DefaultAuthenticationTypes.TwoFactorCookie);
            var userIdentity = await user.GenerateUserIdentityAsync(UserManager);
            if (rememberBrowser)
            {
                var rememberBrowserIdentity = AuthenticationManager.CreateTwoFactorRememberBrowserIdentity(user.Id);
                AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, userIdentity, rememberBrowserIdentity);
            }
            else
            {
                AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, userIdentity);
            }
        }

        public async Task<bool> SendTwoFactorCode(string provider)
        {
            var userId = await GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return false;
            }

            var token = await UserManager.GenerateTwoFactorTokenAsync(userId, provider);
            // See IdentityConfig.cs to plug in Email/SMS services to actually send the code
            await UserManager.NotifyTwoFactorTokenAsync(userId, provider, token);
            return true;
        }

        public async Task<string> GetVerifiedUserIdAsync()
        {
            var result = await AuthenticationManager.AuthenticateAsync(DefaultAuthenticationTypes.TwoFactorCookie);
            if (result != null && result.Identity != null && !String.IsNullOrEmpty(result.Identity.GetUserId()))
            {
                return result.Identity.GetUserId();
            }
            return null;
        }

        public async Task<bool> HasBeenVerified()
        {
            return await GetVerifiedUserIdAsync() != null;
        }

        public async Task<RSignInStatus> TwoFactorSignIn(string provider, string code, bool isPersistent, bool rememberBrowser)
        {
            var userId = await GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return RSignInStatus.Failure;
            }
            var user = await UserManager.FindByIdAsync(userId);
            if (user == null)
            {
                return RSignInStatus.Failure;
            }
            if (await UserManager.IsLockedOutAsync(user.Id))
            {
                return RSignInStatus.LockedOut;
            }
            if (await UserManager.VerifyTwoFactorTokenAsync(user.Id, provider, code))
            {
                // When token is verified correctly, clear the access failed count used for lockout
                await UserManager.ResetAccessFailedCountAsync(user.Id);
                await SignInAsync(user, isPersistent, rememberBrowser);
                return RSignInStatus.Success;
            }
            // If the token is incorrect, record the failure which also may cause the user to be locked out
            await UserManager.AccessFailedAsync(user.Id);
            return RSignInStatus.Failure;
        }

        public async Task<RSignInStatus> ExternalSignIn(ExternalLoginInfo loginInfo, bool isPersistent)
        {
            var user = await UserManager.FindAsync(loginInfo.Login);
            if (user == null)
            {
                return RSignInStatus.Failure;
            }
            if (await UserManager.IsLockedOutAsync(user.Id))
            {
                return RSignInStatus.LockedOut;
            }
            return await SignInOrTwoFactor(user, isPersistent);
        }

        private async Task<RSignInStatus> SignInOrTwoFactor(RedfernUser user, bool isPersistent)
        {
            if (await UserManager.GetTwoFactorEnabledAsync(user.Id) &&
                !await AuthenticationManager.TwoFactorBrowserRememberedAsync(user.Id))
            {
                var identity = new ClaimsIdentity(DefaultAuthenticationTypes.TwoFactorCookie);
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
                AuthenticationManager.SignIn(identity);
                return RSignInStatus.RequiresTwoFactorAuthentication;
            }
            await SignInAsync(user, isPersistent, false);
            return RSignInStatus.Success;

        }

        public async Task<RSignInStatus> PasswordSignIn(string userName, string password, bool isPersistent, bool shouldLockout)
        {
            var user = await UserManager.FindByNameAsync(userName);
            if (user == null)
            {
                return RSignInStatus.NotFound;
            }
            if (await UserManager.IsLockedOutAsync(user.Id))
            {
                return RSignInStatus.LockedOut;
            }
            if (await UserManager.CheckPasswordAsync(user, password))
            {
                return await SignInOrTwoFactor(user, isPersistent);
            }
            if (shouldLockout)
            {
                // If lockout is requested, increment access failed count which might lock out the user
                await UserManager.AccessFailedAsync(user.Id);
                if (await UserManager.IsLockedOutAsync(user.Id))
                {
                    return RSignInStatus.LockedOut;
                }
            }
            return RSignInStatus.Failure;
        }
    }
}