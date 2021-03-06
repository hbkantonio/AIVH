﻿using AppRendiciones.Infraestructure;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AppRendiciones.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private AuthRepository _repo = null;

        public AccountController()
        {
            _repo = new AuthRepository();
        }

        public async Task<IHttpActionResult> Register(DTO.Usuario userModel)
        {
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var usuario = await _repo.FindUser(userModel.NickName, userModel.Password);
                if (usuario == null)
                {
                    IdentityResult result = await _repo.RegisterUser(userModel);

                    IHttpActionResult errorResult = GetErrorResult(result);

                    if (errorResult != null)
                    {
                        return errorResult;
                    }
                }

                return Ok(true);
            }
            catch (Exception err)
            {
                return BadRequest("Fallo " + err.Message);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        public async Task<IHttpActionResult> UpdateUserAsync(DTO.Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _repo.UpdateUser(usuario);

            if (result != null)
                return Ok(true);
            else
                return BadRequest();
        }

        public async Task<IHttpActionResult> GetBasicosAsync(string username)
        {
            return Ok(await _repo.FindUser(username));
        }

        public async Task<IHttpActionResult> GetBasicAdmin(string UserId)
        {
            return Ok(await _repo.FindUserAdminitradorAsync(UserId));
        }

        public async Task<IHttpActionResult> FindUser(string userId, string password)
        {
            var user = await _repo.FindUser(userId, password);
            if (user != null)
            {
                return Ok(true);
            }
            else { return BadRequest(); }
           
        }
    }
}
