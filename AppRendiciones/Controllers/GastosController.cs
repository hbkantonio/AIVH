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
    [RoutePrefix("Api/Gastos")]
    public class GastosController : ApiController
    {
        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        private AIVHEntities db = new AIVHEntities();

        [Route("Get")]
        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));
                var gastosDb = db.Gasto.Where(a => a.UsuarioIdGenero == usuarioId);
                List<GetGasto> gastos = gastosDb.Select(b => new GetGasto
                {
                    gastoId = b.GastoId,
                    centroCostos = b.CentroCosto.Descripcion,
                    resposable = b.Usuario.Nombre + " " + b.Usuario.Paterno + " " + b.Usuario.Materno,
                    tipoRendicion = b.PagoForma.Descripcion,
                    fechaInicial = b.FechaInicio,
                    fechaFinal2 = b.FechaFin,
                    anticipo = (b.Efectivo + b.ChequeTans ).ToString(),
                    gastos = b.GastoDetalle.Sum(c => c.Total).ToString(),
                    saldo = Math.Abs((b.Efectivo + b.ChequeTans) - b.GastoDetalle.Sum(c => c.Total)).ToString(),
                    observaciones = (b.Efectivo + b.ChequeTans) > b.GastoDetalle.Sum(c => c.Total) ? "Devolucion" : "Reembolso",
                    fecha2 = b.Fecha,
                    estatus = b.EstatusId == 1 ? "En revisión" : b.Estatus.Descripcion,
                    estatusId = b.EstatusId
                }).ToList();

                return Ok(gastos);
            }
            catch (Exception Ex)
            {

                return BadRequest("Error");
            }
        }

        [Route("GetDetails/{gastoId:int}")]
        [HttpGet]
        public IHttpActionResult GetDetails(int gastoId)
        {
            try
            {
                var gastosDb = db.Gasto.Where(a => a.GastoId == gastoId).ToList();
                var gastos = gastosDb.Select(a => new Models.DTO.Gasto
                {
                    gastoId = a.GastoId,
                    centroCostosId = a.CentroCostoId,
                    usuarioId = a.UsuarioId,
                    pagoFormaId = a.PagoFormaId,
                    fechaInicio = a.FechaFin.ToString("dd/MM/yyyy", Cultura),
                    fechaFin = a.FechaFin.ToString("dd/MM/yyyy", Cultura),
                    efectivo = a.Efectivo,
                    chequeTransNuevo = a.ChequeTans,
                    fechaNuevo = a.FechasChequeTans != null ? a.FechasChequeTans?.ToString("dd/MM/yyyy", Cultura) : "",
                    numeroNuevo = a.NumeroChequeTans != "" ? a.NumeroChequeTans : "",
                    gastoDetalle = a.GastoDetalle.Select(b => new Models.DTO.GastoDetalle
                    {
                        consecutivoId = b.ConsecutivoId,
                        comprobanteTipoId = b.ComprobanteTipoId,
                        comprobanteTipo = b.ComprobanteTipo.Descripcion,
                        fecha = b.Fecha.ToString("dd/MM/yyyy", Cultura),
                        conceptoId = b.SubConcepto.Concepto.ConceptoId,
                        concepto = b.SubConcepto.Concepto.Descripcion,
                        subConceptoId = b.SubConceptoId,
                        subConcepto = b.SubConcepto.Descripcion,
                        descripcion = b.Descripcion,
                        proveedor = b.Proveedor,
                        subTotal = b.SubTotal,
                        iva = b.Iva,
                        total = b.Total
                    }).ToList()
                }).FirstOrDefault();


                return Ok(gastos);
            }
            catch (Exception Ex)
            {

                return BadRequest("Error");
            }
        }

        [Route("Save")]
        [HttpPost]
        public IHttpActionResult Save(Models.DTO.Gasto gastos)
        {
            try
            {
                int usuarioId = int.Parse(DbContextAIVH.GetUserName(User));

                List<Models.GastoDetalle> gastoDetalle = new List<Models.GastoDetalle>();
                int consecutivoId = 1;
                gastos.gastoDetalle.ForEach(n =>
                {
                    if (gastos.gastoId == 0)
                    {
                        gastoDetalle.Add(new Models.GastoDetalle
                        {
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
                    }
                    else
                    {
                        gastoDetalle.Add(new Models.GastoDetalle
                        {
                            GastoId = gastos.gastoId,
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
                    }
                    consecutivoId += 1;
                });

                DateTime? nulo = null;

                if (gastos.gastoId == 0)
                {
                    db.Gasto.Add(new Models.Gasto
                    {
                        CentroCostoId = gastos.centroCostosId,
                        UsuarioId = gastos.usuarioId,
                        PagoFormaId = gastos.pagoFormaId,
                        FechaInicio = DateTime.ParseExact((gastos.fechaInicio.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                        FechaFin = DateTime.ParseExact((gastos.fechaFin.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                        Efectivo = gastos.efectivo,
                        ChequeTans = gastos.chequeTransNuevo,
                        FechasChequeTans = gastos.fechaNuevo != "" ? DateTime.ParseExact((gastos.fechaNuevo.Replace("-", "/")), "dd/MM/yyyy", CultureInfo.InvariantCulture) : nulo,
                        NumeroChequeTans = gastos.numeroNuevo,
                        Fecha = DateTime.Now,
                        Hora = DateTime.Now.TimeOfDay,
                        UsuarioIdGenero = usuarioId,
                        EstatusId = 1,
                        GastoDetalle = gastoDetalle
                    });
                }
                else
                {
                    var gastoDb = db.Gasto.Where(a => a.GastoId == gastos.gastoId).FirstOrDefault();
                    db.GastoDetalle.RemoveRange(gastoDb.GastoDetalle);

                    gastoDb.CentroCostoId = gastos.centroCostosId;
                    gastoDb.UsuarioId = gastos.usuarioId;
                    gastoDb.PagoFormaId = gastos.pagoFormaId;
                    gastoDb.FechaInicio = DateTime.ParseExact((gastos.fechaInicio.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    gastoDb.FechaFin = DateTime.ParseExact((gastos.fechaFin.Replace('-', '/')), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    gastoDb.Efectivo = gastos.efectivo;
                    gastoDb.ChequeTans = gastos.chequeTransNuevo;
                    gastoDb.FechasChequeTans = gastos.fechaNuevo != "" ? DateTime.ParseExact((gastos.fechaNuevo.Replace("-", "/")), "dd/MM/yyyy", CultureInfo.InvariantCulture) : nulo;
                    gastoDb.NumeroChequeTans = gastos.numeroNuevo;
                    gastoDb.Fecha = DateTime.Now;
                    gastoDb.Hora = DateTime.Now.TimeOfDay;
                    gastoDb.UsuarioIdGenero = usuarioId;
                    db.GastoDetalle.AddRange(gastoDetalle);
                }

                db.SaveChanges();

                int gastoId = db.Gasto.Local.FirstOrDefault().GastoId;

                return Ok(new
                {
                    message = "La rendición de gastos se guardó correctamente.",
                    gastoId
                });
            }
            catch (Exception Ex)
            {
                return BadRequest("Error al guardar rendicion de gastos");
            }

        }

        [HttpGet]
        [Route("ReporteGastos/{gastoId:int}")]
        public IHttpActionResult ReporteGastos(int gastoId)
        {
            try
            {
                var gastosDb = db.Gasto.Where(a => a.GastoId == gastoId).ToList();
                var gastos = gastosDb.Select(a => new Models.DTO.Gasto
                {
                    centroCostos = a.CentroCosto.Descripcion,
                    usuario = a.Usuario.Nombre + " " + a.Usuario.Paterno + " " + a.Usuario.Materno,
                    pagoForma = a.PagoForma.Descripcion,
                    fechaInicio = a.FechaFin.ToString("dd/MM/yyyy", Cultura),
                    fechaFin = a.FechaFin.ToString("dd/MM/yyyy", Cultura),
                    efectivo = a.Efectivo,
                    chequeTransNuevo = a.ChequeTans,
                    fechaNuevo = a.FechasChequeTans != null ? a.FechasChequeTans?.ToString("dd/MM/yyyy", Cultura) : "SF",
                    numeroNuevo = a.NumeroChequeTans != "" ? a.NumeroChequeTans : "SN",
                    usuarioGenero = a.Usuario1.Nombre + " " + a.Usuario1.Paterno + " " + a.Usuario1.Materno
                }).ToList();

                var gastoDetalle = gastosDb.FirstOrDefault().GastoDetalle.Select(b => new Models.DTO.GastoDetalle
                {
                    comprobanteTipo = b.ComprobanteTipo.Descripcion,
                    fecha = b.Fecha.ToString("dd/MM/yyyy", Cultura),
                    concepto = b.SubConcepto.Concepto.Descripcion,
                    subConcepto = b.SubConcepto.Descripcion,
                    descripcion = b.Descripcion,
                    proveedor = b.Proveedor,
                    subTotal = b.SubTotal,
                    iva = b.Iva,
                    total = b.Total,
                }).ToList();

                reports.Gastos rptGastos = new reports.Gastos();

                rptGastos.Database.Tables["Gasto"].SetDataSource(gastos);
                rptGastos.Database.Tables["GastoDetalle"].SetDataSource(gastoDetalle);

                Stream PDFContrato;
                PDFContrato = rptGastos.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);

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

    }
}
