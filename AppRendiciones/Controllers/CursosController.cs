using AppRendiciones.Infraestructure;
using AppRendiciones.Models;
using AppRendiciones.Models.DTO;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
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
                    anticipo = b.Efectivo + b.ChequeTans,
                    gastos = b.CursoGastoDetalle.Select(d => new Models.DTO.CursoGastoDetalle
                    {
                        cursoId = d.CursoId,
                        consecutivoId = d.ConsecutivoId,
                        instructorId = d.UsuarioId,
                        instructor = d.Usuario.Nombre + " " + d.Usuario.Paterno + " " + d.Usuario.Materno,
                        comprobanteTipoId = d.ComprobanteTipoId,
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
                    }).ToList(),
                    totalGastos = b.CursoGastoDetalle.Sum(c => c.Total).ToString(),
                    saldo = Math.Abs((b.Efectivo + b.ChequeTans) - b.CursoGastoDetalle.Sum(c => c.Total)).ToString(),
                    observaciones = (b.Efectivo + b.ChequeTans) > b.CursoGastoDetalle.Sum(c => c.Total) ? "Devolucion" : (b.Efectivo + b.ChequeTans) == b.CursoGastoDetalle.Sum(c => c.Total) ? "" : "Reembolso"
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

                //insertar participantes
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

                //insertar gastos de comision de instructores
                var pagoParticipantes = curso.participantes.Sum(a => a.efectivo + a.cheque + a.deposito + a.tarjeta);

                List<Models.CursoGastoDetalle> cursoGastoDetalle = new List<Models.CursoGastoDetalle>();

                if (curso.cursoId == 0)
                {
                    cursoGastoDetalle.Add(new Models.CursoGastoDetalle
                    {
                        ConsecutivoId = 1,
                        UsuarioId = curso.instructorId1,
                        ComprobanteTipoId = 3,
                        Fecha = DateTime.Now,
                        SubConceptoId = 3,
                        Descripcion = "Comisión por impartición de curso " + curso.comision1 + " %.",
                        Proveedor = db.Usuario.Where(a => a.UsuarioId == curso.instructorId1).Select(b => b.Nombre + " " + b.Paterno + " " + b.Materno).FirstOrDefault(),
                        SubTotal = (curso.comision1 * pagoParticipantes) / 100,
                        Iva = 0,
                        Total = (curso.comision1 * pagoParticipantes) / 100
                    });

                    if (curso.instructorId2 != 0)
                    {
                        cursoGastoDetalle.Add(new Models.CursoGastoDetalle
                        {
                            ConsecutivoId = 2,
                            UsuarioId = curso.instructorId2,
                            ComprobanteTipoId = 3,
                            Fecha = DateTime.Now,
                            SubConceptoId = 3,
                            Descripcion = "Comisión por impartición de curso " + curso.comision2 + " %.",
                            Proveedor = db.Usuario.Where(a => a.UsuarioId == curso.instructorId2).Select(b => b.Nombre + " " + b.Paterno + " " + b.Materno).FirstOrDefault(),
                            SubTotal = (curso.comision2 * pagoParticipantes) / 100,
                            Iva = 0,
                            Total = (curso.comision2 * pagoParticipantes) / 100
                        });
                    }
                }
                else
                {
                    int consecutivoGastos = 1;

                    cursoGastoDetalle.Add(new Models.CursoGastoDetalle
                    {
                        CursoId = curso.cursoId,
                        ConsecutivoId = consecutivoGastos,
                        UsuarioId = curso.instructorId1,
                        ComprobanteTipoId = 3,
                        Fecha = DateTime.Now,
                        SubConceptoId = 3,
                        Descripcion = "Comisión por impartición de curso " + curso.comision1 + "%.",
                        Proveedor = db.Usuario.Where(a => a.UsuarioId == curso.instructorId1).Select(b => b.Nombre + " " + b.Paterno + " " + b.Materno).FirstOrDefault(),
                        SubTotal = (curso.comision1 * pagoParticipantes) / 100,
                        Iva = 0,
                        Total = (curso.comision1 * pagoParticipantes) / 100
                    });
                    if (curso.instructorId2 != 0)
                    {
                        consecutivoGastos += 1;
                        cursoGastoDetalle.Add(new Models.CursoGastoDetalle
                        {
                            CursoId = curso.cursoId,
                            ConsecutivoId = consecutivoGastos,
                            UsuarioId = curso.instructorId2,
                            ComprobanteTipoId = 3,
                            Fecha = DateTime.Now,
                            SubConceptoId = 3,
                            Descripcion = "Comisión por impartición de curso " + curso.comision2 + " %.",
                            Proveedor = db.Usuario.Where(a => a.UsuarioId == curso.instructorId2).Select(b => b.Nombre + " " + b.Paterno + " " + b.Materno).FirstOrDefault(),
                            SubTotal = (curso.comision2 * pagoParticipantes) / 100,
                            Iva = 0,
                            Total = (curso.comision2 * pagoParticipantes) / 100
                        });
                    }

                    var gastos = db.CursoGastoDetalle.Where(a => a.CursoId == curso.cursoId && a.SubConceptoId != 3).ToList();

                    gastos.ForEach(n =>
                    {
                        consecutivoGastos += 1;
                        cursoGastoDetalle.Add(new Models.CursoGastoDetalle
                        {
                            CursoId = n.CursoId,
                            ConsecutivoId = consecutivoGastos,
                            UsuarioId = n.UsuarioId,
                            ComprobanteTipoId = n.ComprobanteTipoId,
                            Fecha = n.Fecha,
                            SubConceptoId = n.SubConceptoId,
                            Descripcion = n.Descripcion,
                            Proveedor = n.Proveedor,
                            SubTotal = n.SubTotal,
                            Iva = n.Iva,
                            Total = n.Total
                        });
                    });

                }


                // insertar curso
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
                        CursoParticipante = cursoParticipante,
                        CursoGastoDetalle = cursoGastoDetalle
                    });
                }
                else
                {
                    var cursoDb = db.Curso.Where(a => a.CursoId == curso.cursoId).FirstOrDefault();
                    db.CursoParticipante.RemoveRange(cursoDb.CursoParticipante);
                    db.CursoGastoDetalle.RemoveRange(cursoDb.CursoGastoDetalle);

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
                    db.CursoGastoDetalle.AddRange(cursoGastoDetalle);
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

        [HttpGet]
        [Route("ReporteCurso/{cursoId:int}")]
        public IHttpActionResult ReporteCurso(int cursoId)
        {
            try
            {
                var cursoDb = db.Curso.Where(a => a.CursoId == cursoId).ToList();
                var curso = cursoDb.Select(a => new Models.DTO.Curso
                {
                    folio = a.CentroCosto.Nomenglatura + a.CursoId,
                    centroCostos = a.CentroCosto.Descripcion,
                    sede = a.Sede.Descripcion,
                    lugarCurso = a.LugarCurso,
                    cursoTipo = a.CursoTipo.Descripcion,
                    instructor1 = a.Usuario.Nombre + " " + a.Usuario.Paterno + " " + a.Usuario.Materno,
                    comision1 = a.Comision1,
                    instructor2 = db.Usuario.Where(b => b.UsuarioId == a.UsuarioId2).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                    comision2 = a.Comision2,
                    fechaCurso = a.FechaCurso.ToString("dd/MM/yyyy", Cultura),
                    efectivo = a.Efectivo,
                    chequeTans = a.ChequeTans,
                    fechachequeTans = a.FechasChequeTans != null ? a.FechasChequeTans?.ToString("dd/MM/yyyy", Cultura) : "SF",
                    numeroChequeTans = a.NumeroChequeTans != "" ? a.NumeroChequeTans : "SN",
                    usuarioGenero = a.Usuario1.Nombre + " " + a.Usuario1.Paterno + " " + a.Usuario1.Materno,
                    totalGastosD = a.CursoGastoDetalle.Sum(s=> s.Total)
                }).ToList();


                var participantes = cursoDb.FirstOrDefault().CursoParticipante.Select(b => new Participante
                {
                    participanteId = b.ParticipanteId,
                    nombre = b.Nombre + " " + b.Apellido,
                    efectivo = b.Efectivo,
                    deposito = b.DepositooTransferencia,
                    cheque = b.Cheque,
                    tarjeta = b.TarjetaCredito,
                    email = b.Email,
                    celular = b.Celular
                }).ToList();

                var gastos = cursoDb.FirstOrDefault().CursoGastoDetalle.Select(b => new Models.DTO.CursoGastoDetalle
                {
                    instructor = b.Usuario.Nombre + " " + b.Usuario.Paterno + " " + b.Usuario.Materno,
                    comprobanteTipo = b.ComprobanteTipo.Descripcion,
                    fecha = b.Fecha.ToString("dd/MM/yyyy", Cultura),
                    concepto = b.SubConcepto.Concepto.Descripcion,
                    subConcepto = b.SubConcepto.Descripcion,
                    descripcion = b.Descripcion,
                    proveedor = b.Proveedor,
                    subTotal = b.SubTotal,
                    iva = b.Iva,
                    total = b.Total
                }).ToList();

                reports.Cursos rptCurso = new reports.Cursos();

                rptCurso.Database.Tables["Curso"].SetDataSource(curso);
                rptCurso.Database.Tables["CursoParticipante"].SetDataSource(participantes);
                rptCurso.Database.Tables["CursoGastoDetalle"].SetDataSource(gastos);

                Stream PDFContrato;
                PDFContrato = rptCurso.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);

                var MemoryStream = new MemoryStream();
                PDFContrato.CopyTo(MemoryStream);

                byte[] result = MemoryStream.ToArray();

                var res = Convert.ToBase64String(result);

                return Ok(res);
            }
            catch (Exception Ex)
            {
                return BadRequest("Error");
            }

        }

        [HttpGet]
        [Route("Aprobar/{cursoId:int}")]
        public IHttpActionResult Aprobar(int cursoId)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                var curso = db.Curso.Where(a => a.CursoId == cursoId).FirstOrDefault();
                curso.EstatusId = 3;
                curso.Fecha = DateTime.Now;
                curso.Hora = DateTime.Now.TimeOfDay;
                curso.UsuarioIdGenero = usuarioId;

                db.SaveChanges();

                return Ok("La rendicion se aprobo correctamente.");
            }
            catch (Exception Ex)
            {
                return BadRequest("Error");
            }

        }
    }
}
