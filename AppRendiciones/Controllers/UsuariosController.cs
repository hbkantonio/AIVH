using AppRendiciones.Infraestructure;
using AppRendiciones.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace AppRendiciones.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Usuarios")]
    public class UsuariosController : ApiController
    {
        private AIVHEntities db = new AIVHEntities();

        [Route("Get")]
        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {
                List<DTO.Usuario> usuario = db.Usuario
                    .Select(a => new DTO.Usuario
                    {
                        UsuarioId = a.UsuarioId,
                        Nombre = a.Nombre,
                        Paterno = a.Paterno,
                        Materno = a.Materno,
                        RolId = a.UsuarioRolId,
                        Rol = a.UsuarioRol.Descripcion,
                        EstatusId = a.EstatusId,
                        Estatus = a.Estatus.Descripcion
                    }).ToList();

                return Ok(usuario);
            }
            catch (Exception Ex)
            {
                return BadRequest("Error");
            }
        }

        [Route("SaveUsuario")]
        [HttpPost]
        public async Task<IHttpActionResult> SaveUsuario(DTO.Usuario usuario)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                
                if (usuario.UsuarioId != 0)
                {
                    var usuarioDb = db.Usuario.Where(a => a.UsuarioId == usuario.UsuarioId).FirstOrDefault();
                    usuarioDb.Nombre = usuario.Nombre;
                    usuarioDb.Paterno = usuario.Paterno;
                    usuarioDb.Materno = usuario.Materno;
                    usuarioDb.UsuarioRolId = usuario.RolId;
                    usuarioDb.Fecha = DateTime.Now;
                    usuarioDb.Hora = DateTime.Now.TimeOfDay;
                    usuarioDb.UsuarioIdGenero = usuarioId;
                    usuarioDb.EstatusId = usuario.EstatusId;
                }
                else
                {
                    db.Usuario.Add(new Usuario
                    {
                        Nombre = usuario.Nombre,
                        Paterno = usuario.Paterno,
                        Materno = usuario.Materno,
                        UsuarioRolId = usuario.RolId,
                        Fecha = DateTime.Now,
                        Hora = DateTime.Now.TimeOfDay,
                        UsuarioIdGenero = usuarioId,
                        EstatusId = usuario.EstatusId
                    });

                }
                
                db.SaveChanges();
                AccountController accountController = new AccountController();
                IHttpActionResult result = null;
                if (usuario.UsuarioId != 0 && usuario.Password != "")
                {
                     result = await accountController.UpdateUserAsync(usuario);
                }
                else if (usuario.UsuarioId == 0)
                {
                    usuario.NickName = db.Usuario.Local.FirstOrDefault().UsuarioId.ToString();
                     result = await accountController.Register(usuario);
                }
               

                if (result is OkNegotiatedContentResult<bool> status || result == null)
                {
                    return Ok(new
                    {
                        message = "El usuario se guardó correctamente."
                    });
                }
                else
                {
                    return BadRequest("Error al guardar usuario");
                }
                
            }
            catch (Exception Ex)
            {
                return BadRequest("Error al guardar usuario");
            }
        }

    }

}
