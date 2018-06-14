using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Security.Claims;
using System.Security.Principal;

namespace AppRendiciones.Infraestructure
{
    public class AIVHContext : IdentityDbContext<IdentityUser>
    {
        public AIVHContext()
            : base("AIVHContext")
        {

        }
    }

    public class DbContextAIVH
    {
        internal static string GetUserName(IPrincipal user)
        {
            string username = "";
            var identity = (ClaimsIdentity)user.Identity;
            IEnumerable<Claim> claims = identity.Claims;

            claims.ToList().ForEach(cl =>
            {
                if (cl.Type == "Name")
                {
                    username = cl.Value;
                }
            });

            return username;
        }

        internal static string GetUsuario(IPrincipal user)
        {
            string userId = "";
            var identity = (ClaimsIdentity)user.Identity;
            IEnumerable<Claim> claims = identity.Claims;

            claims.ToList().ForEach(cl =>
            {
                if (cl.Type == "userId")
                {
                    userId = cl.Value;
                }
            });

            return userId;
        }
    }
}