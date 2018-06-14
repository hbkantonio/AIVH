using AppRendiciones.Infraestructure;
using AppRendiciones.Models;
using AppRendiciones.Models.DTO;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AppRendiciones.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Cursos")]
    public class CursosController : ApiController
    {

        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        private AIVHEntities db = new AIVHEntities();


        [Route("Get")]
        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {
                var cursosDb = db.Curso.ToList();
                List<Models.DTO.Curso> cursos = cursosDb.Select(b => new Models.DTO.Curso
                {
                    folio = b.CentroCosto.Nomenglatura + b.CursoId,
                    cursoId = b.CursoId,
                    centroCostosId = b.CentroCostoId,
                    centroCostos = b.CentroCosto.Descripcion,
                    sedeId = b.SedeId,
                    sede = b.Sede.Descripcion,
                    lugarCurso = b.LugarCurso,
                    cursoTipoId = b.CursoTipo.CursoTipoId,
                    cursoTipo = b.CursoTipo.Descripcion,
                    instructorId1 = b.UsuarioId1,
                    instructor1 = b.Usuario1.Nombre + " " + b.Usuario1.Paterno + " " + b.Usuario1.Materno,
                    comision1 = b.Comision1,
                    instructorId2 = b.UsuarioId2,
                    instructor2 = db.Usuario.Where(a => a.UsuarioId == b.UsuarioId2).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                    comision2 = b.Comision2,
                    fechaCurso2 = b.FechaCurso,
                    estatusId = b.EstatusId,
                    estatus = b.Estatus.Descripcion,
                    participantes = b.CursoParticipante.Select(c => new Participante
                    {
                        cursoId = c.CursoId,
                        participanteId = c.ParticipanteId,
                        nombre = c.Nombre,
                        apellido = c.Apellido,
                        efectivo = c.Efectivo,
                        deposito = c.DepositooTransferencia,
                        cheque = c.Cheque,
                        tarjeta = c.TarjetaCredito,
                        email = c.Email,
                        celular = c.Celular
                    }).ToList(),
                    efectivo = b.Efectivo,
                    chequeTans = b.ChequeTans,
                    fechachequeTans = b.FechasChequeTans != null ? b.FechasChequeTans?.ToString("dd/MM/yyyy", Cultura) : "",
                    numeroChequeTans = b.NumeroChequeTans,
                    gastos = b.CursoGastoDetalle.Select(d=> new Models.DTO.CursoGastoDetalle
                    {
                        cursoId = d.CursoId,
                        consecutivoId = d.ConsecutivoId,
                        instructorId = d.UsuarioId,
                        instructor = d.Usuario.Nombre +" "+ d.Usuario.Paterno + " " + d.Usuario.Materno,
                        comprobanteTipoId =d.ComprobanteTipoId,
                        comprobanteTipo = d.ComprobanteTipo.Descripcion,
                        fecha2 = d.Fecha,
                        conceptoId = d.SubConcepto.Concepto.ConceptoId,
                        concepto = d.SubConcepto.Concepto.Descripcion,
                        subConceptoId = d.SubConceptoId,
                        subConcepto = d.SubConcepto.Descripcion,
                        descripcion = d.Descripcion,
                        proveedor = d.Proveedor,
                        subTotal = d.SubTotal,
                        iva = d.Iva,
                        total = d.Total
                    }).ToList()
                }).ToList();

                return Ok(cursos);
            }
            catch (Exception Ex)
            {

                return BadRequest("Error");
            }
        }

        [Route("SaveCurso")]
        [HttpPost]
        public IHttpActionResult SaveCurso(Models.DTO.Curso curso)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                List<CursoParticipante> cursoParticipante = new List<CursoParticipante>();
                int consecutivoId = 1;
                curso.participantes.ForEach(n =>
                {
                    if (curso.cursoId == 0)
                    {
                        cursoParticipante.Add(new CursoParticipante
                        {
                            ParticipanteId = consecutivoId,
                            Nombre = n.nombre,
                            Apellido = n.apellido,
                            Efectivo = n.efectivo,
                            DepositooTransferencia = n.deposito,
                            Cheque = n.cheque,
                            TarjetaCredito = n.tarjeta,
                            Email = n.email,
                            Celular = n.celular
                        });
                    }
                    else
                    {
                        cursoParticipante.Add(new CursoParticipante
                        {
                            CursoId = curso.cursoId,
                            ParticipanteId = consecutivoId,
                            Nombre = n.nombre,
                            Apellido = n.apellido,
                            Efectivo = n.efectivo,
                            DepositooTransferencia = n.deposito,
                            Cheque = n.cheque,
                            TarjetaCredito = n.tarjeta,
                            Email = n.email,
                            Celular = n.celular
                        });
                    }
                    consecutivoId += 1;
                });

                if (curso.cursoId == 0)
                {
                    db.Curso.Add(new Models.Curso
                    {
                        CentroCostoId = curso.centroCostosId,
                        SedeId = curso.sedeId,
                        LugarCurso = curso.lugarCurso,
                        CursoTipoId = curso.cursoTipoId,
                        UsuarioId1 = curso.instructorId1,
                        Comision1 = curso.comision1,
                        UsuarioId2 = curso.instructorId2,
                        Comision2 = curso.instructorId2 > 0 ? curso.comision2 : 0,
                        FechaCurso = DateTime.ParseExact((curso.fechaCurso.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                        Efectivo = 0,
                        ChequeTans = 0,
                        NumeroChequeTans = "",
                        Fecha = DateTime.Now,
                        Hora = DateTime.Now.TimeOfDay,
                        UsuarioIdGenero = usuarioId,
                        EstatusId = 1,
                        CursoParticipante = cursoParticipante
                    });
                }
                else
                {
                    var cursoDb = db.Curso.Where(a => a.CursoId == curso.cursoId).FirstOrDefault();
                    db.CursoParticipante.RemoveRange(cursoDb.CursoParticipante);

                    cursoDb.CentroCostoId = curso.centroCostosId;
                    cursoDb.SedeId = curso.sedeId;
                    cursoDb.LugarCurso = curso.lugarCurso;
                    cursoDb.CursoTipoId = curso.cursoTipoId;
                    cursoDb.UsuarioId1 = curso.instructorId1;
                    cursoDb.Comision1 = curso.comision1;
                    cursoDb.UsuarioId2 = curso.instructorId2;
                    cursoDb.Comision2 = curso.instructorId2 > 0 ? curso.comision2 : 0;
                    cursoDb.FechaCurso = DateTime.ParseExact((curso.fechaCurso.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    cursoDb.Fecha = DateTime.Now;
                    cursoDb.Hora = DateTime.Now.TimeOfDay;
                    cursoDb.UsuarioIdGenero = usuarioId;
                    cursoDb.EstatusId = 1;
                    db.CursoParticipante.AddRange(cursoParticipante);
                }

                db.SaveChanges();

                int cursoId = db.Curso.Local.FirstOrDefault().CursoId;

                return Ok(new
                {
                    message = "El curso se guardó correctamente.",
                    cursoId
                });
            }
            catch (Exception Ex)
            {
                return BadRequest("Error al guardar curso");
            }

        }

        [Route("SaveRendicion")]
        [HttpPost]
        public IHttpActionResult SaveRendicion(Models.DTO.Curso curso)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                List<Models.CursoGastoDetalle> cursoGastoDetalle = new List<Models.CursoGastoDetalle>();
                int consecutivoId = 1;
                curso.gastos.ForEach(n =>
                {
                    cursoGastoDetalle.Add(new Models.CursoGastoDetalle
                    {
                        CursoId = curso.cursoId,
                        ConsecutivoId = consecutivoId,
                        UsuarioId = n.instructorId,
                        ComprobanteTipoId = n.comprobanteTipoId,
                        Fecha = DateTime.ParseExact((n.fecha.Replace("-", "/")), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                        SubConceptoId = n.subConceptoId,
                        Descripcion = n.descripcion,
                        Proveedor = n.proveedor,
                        SubTotal = n.subTotal,
                        Iva = n.iva,
                        Total = n.total
                    });
                    consecutivoId += 1;
                });
                DateTime? nulo = null;

                var cursoDb = db.Curso.Where(a => a.CursoId == curso.cursoId).FirstOrDefault();
                db.CursoGastoDetalle.RemoveRange(cursoDb.CursoGastoDetalle);

                cursoDb.Efectivo = curso.efectivo;
                cursoDb.ChequeTans = curso.chequeTans;
                cursoDb.FechasChequeTans = curso.fechachequeTans != "" ? DateTime.ParseExact((curso.fechachequeTans.Replace("-", "/")), "dd/MM/yyyy", CultureInfo.InvariantCulture) : nulo;
                cursoDb.NumeroChequeTans = curso.numeroChequeTans;
                cursoDb.Fecha = DateTime.Now;
                cursoDb.Hora = DateTime.Now.TimeOfDay;
                cursoDb.UsuarioIdGenero = usuarioId;

                if (cursoGastoDetalle.Count > 0) { db.CursoGastoDetalle.AddRange(cursoGastoDetalle); }



                db.SaveChanges();

                int cursoId = db.Curso.Local.FirstOrDefault().CursoId;

                return Ok(new
                {
                    message = "El curso se guardó correctamente.",
                    cursoId
                });
            }
            catch (Exception Ex)
            {
                return BadRequest("Error al guardar curso");
            }

        }
    }
}
