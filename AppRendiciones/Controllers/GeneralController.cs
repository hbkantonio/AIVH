using AppRendiciones.Infraestructure;
using AppRendiciones.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AppRendiciones.Controllers
{
    [Authorize]
    [RoutePrefix("Api/General")]
    public class GeneralController : ApiController
    {

        private AIVHEntities db = new AIVHEntities();

        [Route("GetMenu")]
        [HttpGet]
        public IHttpActionResult GetMenu()
        {
            return Ok(Business.General.Modulo.Get(db,int.Parse(DbContextAIVH.GetUserName(User))));
        }

        [Route("GetPerfil")]
        [HttpGet]
        public IHttpActionResult GetPerfil()
        {
            int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));
            var data = db.Usuario
                .Where(x => x.UsuarioId == usuarioId)
                .Select(x => new {
                    nombre = x.Nombre + " " + x.Paterno + " " + x.Materno,
                    rol = x.UsuarioRol.Descripcion
                }).FirstOrDefault();

            if (data != null)
            {
                return Ok(data);
            }
            else
            {
                return NotFound();
            }
        }

        [Route("GetCentroCostos")]
        [HttpGet]
        public IHttpActionResult GetCentroCostos()
        {
            try
            {

                return Ok(db.CentroCosto
                .Select(x =>
                    new
                    {
                        value = x.CentroCostoId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetInstructor")]
        [HttpGet]
        public IHttpActionResult GetInstructor()
        {
            try
            {

                return Ok(db.Usuario
                .Select(x =>
                    new
                    {
                        value = x.UsuarioId,
                        text = x.Nombre +" "+ x.Paterno +" "+x.Materno 
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetTipoRendicion")]
        [HttpGet]
        public IHttpActionResult GetTipoRendicion()
        {
            try
            {
                return Ok(db.PagoForma
                .Select(x =>
                    new
                    {
                        value = x.PagoFormaId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetComprobanteTipo")]
        [HttpGet]
        public IHttpActionResult GetComprobanteTipo()
        {
            try
            {
                return Ok(db.ComprobanteTipo
                .Select(x =>
                    new
                    {
                        value = x.ComprobanteTipoId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetConcepto")]
        [HttpGet]
        public IHttpActionResult GetConcepto()
        {
            try
            {
                return Ok(db.Concepto
                .Select(x =>
                    new
                    {
                        value = x.ConceptoId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetSubConcepto/{conceptoId:int}")]
        [HttpGet]
        public IHttpActionResult GetSubConcepto(int conceptoId)
        {
            try
            {
                return Ok(db.SubConcepto
                .Where(y=> y.ConceptoId == conceptoId)
                .Select(x =>
                    new
                    {
                        value = x.SubConceptoId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetSede")]
        [HttpGet]
        public IHttpActionResult GetSede()
        {
            try
            {
                return Ok(db.Sede
                .Select(x =>
                    new
                    {
                        value = x.SedeId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [Route("GetTipoCurso")]
        [HttpGet]
        public IHttpActionResult GetTipoCurso()
        {
            try
            {
                return Ok(db.CursoTipo
                .Select(x =>
                    new
                    {
                        value = x.CursoTipoId,
                        text = x.Descripcion
                    })
                .ToList());
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

    }
}
