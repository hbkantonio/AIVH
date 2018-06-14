using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Threading.Tasks;
using DTO;


namespace AppRendiciones.Infraestructure
{
    public class AuthRepository : IDisposable
    {
        private AIVHContext _ctx;

        private UserManager<IdentityUser> _userManager;

        public AuthRepository()
        {
            _ctx = new AIVHContext();
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(Usuario Usuario)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = Usuario.NickName,
                Email = Usuario.Email,
                PhoneNumber = Usuario.Telefono
            };

            var result = await _userManager.CreateAsync(user, Usuario.Password);

            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public async Task<IdentityUser> FindUser(string userName)
        {
            IdentityUser userdb = await _userManager.FindByNameAsync(userName);

            return userdb;
        }

        public async Task<IdentityResult> UpdateUser(Usuario Usuario)
        {
            var user = await _userManager.FindByNameAsync(Usuario.NickName);
            if (user != null)
            {
                user.PasswordHash = _userManager.PasswordHasher.HashPassword(Usuario.Password);
                user.Email = Usuario.Email;
                user.PhoneNumber = Usuario.Telefono;

                var result = await _userManager.UpdateAsync(user);

                return result;
            }
            else
            {
                return null;
            }

        }

        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }

        internal async Task<object> FindUserAdminitradorAsync(string Iduser)
        {
            IdentityUser userdb = await _userManager.FindByIdAsync(Iduser);

            return userdb;
        }
    }
}