using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AppRendiciones.Infraestructure;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;
using System.Security.Claims;
using System.Threading.Tasks;
using AppRendiciones.Models;

namespace AppRendiciones.Auth
{
    public class Autentificacion : OAuthAuthorizationServerProvider
    {
        private AIVHEntities db = new AIVHEntities();

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
                var UsuarioId = int.Parse(context.UserName);
                if (user == null)
                {
                    context.SetError("invalid_grant", "El nombre de usuario o contraseña son incorrectos.");
                    return;
                }
                else if (db.Usuario.Where(a => a.UsuarioId == UsuarioId).FirstOrDefault().EstatusId != 1)
                {
                    context.SetError("invalid_grant", "La cuenta está inactivo.");
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