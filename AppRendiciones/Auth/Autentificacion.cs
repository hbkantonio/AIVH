using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AppRendiciones.Infraestructure;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AppRendiciones.Auth
{
    public class Autentificacion : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            string personId = "";

            using (AuthRepository _repo = new AuthRepository())
            {
                IdentityUser user = await _repo.FindUser(context.UserName, context.Password);

                if (user == null)
                {
                    context.SetError("invalid_grant", "El nombre de usuario o contraseña son incorrectos.");
                    return;
                }
                personId = user.Id;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("Name", context.UserName));
            identity.AddClaim(new Claim("userId", personId));
            identity.AddClaim(new Claim("role", "user"));

            context.Validated(identity);

        }
    }
}