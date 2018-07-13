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
    [RoutePrefix("Api/Eventos")]
    public class EventosController : ApiController
    {

        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        private AIVHEntities db = new AIVHEntities();


        [Route("Get/{RolId:int}")]
        [HttpGet]
        public IHttpActionResult Get(int RolId)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));
                var EventosDb = RolId == 1 ? db.Evento.Where(a=> a.UsuarioId== usuarioId).ToList() : db.Evento.ToList();
                List<Models.DTO.Evento> eventos = EventosDb.Select(b => new Models.DTO.Evento
                {
                    folio = b.CentroCosto.Nomenglatura + b.EventoId,
                    eventoId = b.EventoId,
                    centroCostosId = b.CentroCostoId,
                    centroCostos = b.CentroCosto.Descripcion,
                    lugarEvento = b.LugarEvento,
                    nombreEvento = b.NombreEvento,
                    eventoTipoId = b.EventoTipo.EventoTipoId,
                    eventoTipo = b.EventoTipo.Descripcion,
                    instructorId = b.UsuarioId,
                    instructor = b.Usuario.Nombre + " " + b.Usuario.Paterno + " " + b.Usuario.Materno,
                    fechaEvento2 = b.FechaEvento,
                    estatusId = b.EstatusId,
                    estatus = b.Estatus.Descripcion,
                    donantes = b.EventoDonante.Select(c => new Donantes
                    {
                        eventoId = c.EventoId,
                        donanteId = c.DonanteId,
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
                    gastos = b.EventoGastoDetalle.Select(d => new Models.DTO.EventoGastoDetalle
                    {
                        eventoId = d.EventoId,
                        consecutivoId = d.ConsecutivoId,
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
                    totalRecaudado = b.EventoDonante.Sum(s => s.Efectivo + s.DepositooTransferencia + s.Cheque + s.TarjetaCredito).ToString(),
                    totalGastos = b.EventoGastoDetalle.Sum(c => c.Total).ToString(),
                    saldo = Math.Abs((b.Efectivo + b.ChequeTans) - b.EventoGastoDetalle.Sum(c => c.Total)).ToString(),
                    observaciones = (b.Efectivo + b.ChequeTans) > b.EventoGastoDetalle.Sum(c => c.Total) ? "Devolucion" : (b.Efectivo + b.ChequeTans) == b.EventoGastoDetalle.Sum(c => c.Total) ? "" : "Reembolso"
                }).ToList();

                var periodos = EventosDb.Select(x => new
                {
                    value = x.FechaEvento.ToString("MM/yyyy"),
                    text = Business.General.General.MonthName(x.FechaEvento.Month) + " " + x.FechaEvento.Year
                }).Distinct().ToList();

                return Ok(new{ eventos, periodos});
            }
            catch (Exception Ex)
            {

                return BadRequest("Error");
            }
        }

        [Route("SaveEvento")]
        [HttpPost]
        public IHttpActionResult SaveEvento(Models.DTO.Evento evento)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                // insertar evento
                if (evento.eventoId == 0)
                {
                    db.Evento.Add(new Models.Evento
                    {
                        CentroCostoId = evento.centroCostosId,
                        LugarEvento = evento.lugarEvento,
                        NombreEvento = evento.nombreEvento,
                        EventoTipoId = evento.eventoTipoId,
                        UsuarioId = evento.instructorId,
                        FechaEvento = DateTime.ParseExact((evento.fechaEvento.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                        Efectivo = 0,
                        ChequeTans = 0,
                        NumeroChequeTans = "",
                        Fecha = DateTime.Now,
                        Hora = DateTime.Now.TimeOfDay,
                        UsuarioIdActualizo = usuarioId,
                        EstatusId = 1
                    });
                }
                else
                {
                    var eventoDb = db.Evento.Where(a => a.EventoId == evento.eventoId).FirstOrDefault();

                    eventoDb.CentroCostoId = evento.centroCostosId;
                    eventoDb.LugarEvento = evento.lugarEvento;
                    eventoDb.NombreEvento = evento.nombreEvento;
                    eventoDb.EventoTipoId = evento.eventoTipoId;
                    eventoDb.UsuarioId = evento.instructorId;
                    eventoDb.FechaEvento = DateTime.ParseExact((evento.fechaEvento.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    eventoDb.Fecha = DateTime.Now;
                    eventoDb.Hora = DateTime.Now.TimeOfDay;
                    eventoDb.UsuarioIdActualizo = usuarioId;
                    eventoDb.EstatusId = 1;
                }

                db.SaveChanges();

                int eventoId = db.Evento.Local.FirstOrDefault().EventoId;

                return Ok(new
                {
                    message = "El evento se guardó correctamente.",
                    eventoId
                });
            }
            catch (Exception Ex)
            {
                return BadRequest("Error al guardar evento");
            }

        }

        [Route("SaveRendicion")]
        [HttpPost]
        public IHttpActionResult SaveRendicion(Models.DTO.Evento evento)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                //insertar participantes
                List<EventoDonante> eventoDonante = new List<EventoDonante>();
                int donanteId = 1;
                evento.donantes.ForEach(n =>
                {
                    eventoDonante.Add(new EventoDonante
                    {
                        EventoId = evento.eventoId,
                        DonanteId = donanteId,
                        Nombre = n.nombre,
                        Apellido = n.apellido,
                        Efectivo = n.efectivo,
                        DepositooTransferencia = n.deposito,
                        Cheque = n.cheque,
                        TarjetaCredito = n.tarjeta,
                        Email = n.email,
                        Celular = n.celular
                    });
                    donanteId += 1;
                });

                //insertar gastos
                List<Models.EventoGastoDetalle> eventoGastoDetalle = new List<Models.EventoGastoDetalle>();
                int consecutivoId = 1;
                evento.gastos.ForEach(n =>
                {
                    eventoGastoDetalle.Add(new Models.EventoGastoDetalle
                    {
                        EventoId = evento.eventoId,
                        ConsecutivoId = consecutivoId,
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

                var eventoDb = db.Evento.Where(a => a.EventoId == evento.eventoId).FirstOrDefault();
                db.EventoGastoDetalle.RemoveRange(eventoDb.EventoGastoDetalle);
                db.EventoDonante.RemoveRange(eventoDb.EventoDonante);

                eventoDb.Efectivo = evento.efectivo;
                eventoDb.ChequeTans = evento.chequeTans;
                eventoDb.FechasChequeTans = evento.fechachequeTans != "" ? DateTime.ParseExact((evento.fechachequeTans.Replace("-", "/")), "dd/MM/yyyy", CultureInfo.InvariantCulture) : nulo;
                eventoDb.NumeroChequeTans = evento.numeroChequeTans;
                eventoDb.Fecha = DateTime.Now;
                eventoDb.Hora = DateTime.Now.TimeOfDay;
                eventoDb.UsuarioIdActualizo = usuarioId;

                if (eventoGastoDetalle.Count > 0) { db.EventoGastoDetalle.AddRange(eventoGastoDetalle); }
                if (eventoDonante.Count > 0) { db.EventoDonante.AddRange(eventoDonante); }



                db.SaveChanges();

                int eventoId = db.Evento.Local.FirstOrDefault().EventoId;

                return Ok(new
                {
                    message = "El evento se guardó correctamente.",
                    eventoId
                });
            }
            catch (Exception Ex)
            {
                return BadRequest("Error al guardar evento");
            }
        }

        [HttpGet]
        [Route("ReporteEvento/{eventoId:int}")]
        public IHttpActionResult ReporteEvento(int eventoId)
        {
            try
            {
                var eventoDb = db.Evento.Where(a => a.EventoId == eventoId).ToList();
                var evento = eventoDb.Select(a => new Models.DTO.Evento
                {
                    folio = a.CentroCosto.Nomenglatura + a.EventoId,
                    centroCostos = a.CentroCosto.Descripcion,
                    lugarEvento = a.LugarEvento,
                    nombreEvento = a.NombreEvento,
                    eventoTipo = a.EventoTipo.Descripcion,
                    instructor = a.Usuario.Nombre + " " + a.Usuario.Paterno + " " + a.Usuario.Materno,
                    fechaEvento = a.FechaEvento.ToString("dd/MM/yyyy", Cultura),
                    efectivo = a.Efectivo,
                    chequeTans = a.ChequeTans,
                    fechachequeTans = a.FechasChequeTans != null ? a.FechasChequeTans?.ToString("dd/MM/yyyy", Cultura) : "SF",
                    numeroChequeTans = a.NumeroChequeTans != "" ? a.NumeroChequeTans : "SN",
                    usuarioGenero = a.Usuario1.Nombre + " " + a.Usuario1.Paterno + " " + a.Usuario1.Materno,
                    totalGastosD = a.EventoGastoDetalle.Sum(s => s.Total)
                }).ToList();


                var donantes = eventoDb.FirstOrDefault().EventoDonante.Select(b => new Donantes
                {
                    donanteId = b.DonanteId,
                    nombre = b.Nombre + " " + b.Apellido,
                    efectivo = b.Efectivo,
                    deposito = b.DepositooTransferencia,
                    cheque = b.Cheque,
                    tarjeta = b.TarjetaCredito,
                    email = b.Email,
                    celular = b.Celular
                }).ToList();

                var gastos = eventoDb.FirstOrDefault().EventoGastoDetalle.Select(b => new Models.DTO.EventoGastoDetalle
                {
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

                reports.Eventos rptEvento = new reports.Eventos();

                rptEvento.Database.Tables["Evento"].SetDataSource(evento);
                rptEvento.Database.Tables["EventoDonante"].SetDataSource(donantes);
                rptEvento.Database.Tables["EventoGastoDetalle"].SetDataSource(gastos);

                Stream PDFContrato;
                PDFContrato = rptEvento.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);

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
        [Route("Aprobar/{eventoId:int}")]
        public IHttpActionResult Aprobar(int eventoId)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                var evento = db.Evento.Where(a => a.EventoId == eventoId).FirstOrDefault();
                evento.EstatusId = 3;
                evento.Fecha = DateTime.Now;
                evento.Hora = DateTime.Now.TimeOfDay;
                evento.UsuarioIdActualizo = usuarioId;

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
