using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace AppRendiciones.Models.DTO
{
    public class GetGasto
    {

        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        public int gastoId { get; set; }
        public string centroCostos { get; set; }
        public string resposable { get; set; }
        public string periodo { get; set; }
        public DateTime fechaInicial { get; set; }
        private DateTime fechaFinal { get; set; }
        public DateTime fechaFinal2
        {
            get { return fechaFinal; }
            set { periodo = "Del "+ fechaInicial.ToString("dd/MM/yyyy", Cultura) + " al " + value.ToString("dd/MM/yyyy", Cultura); }
        }
        public string anticipo { get; set; }
        public string gastos { get; set; }
        public string saldo { get; set; }
        public string observaciones { get; set; }
        public string fecha { get; set; }
        private DateTime fecha1 { get; set; }
        public DateTime fecha2
        {
            get { return fecha1; }
            set { fecha = value.ToString("dd/MM/yyyy", Cultura); }
        }
        public string estatus { get; set; }
        public int estatusId { get; set; }
    }

    public class Gasto
    {
        public int gastoId { get; set; }
        public int centroCostosId { get; set; }
        public string centroCostos { get; set; }
        public int usuarioId { get; set; }
        public string usuario { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }
        public decimal efectivo { get; set; }
        public decimal chequeTransNuevo { get; set; }
        public string fechaNuevo { get; set; }
        public string numeroNuevo { get; set; }
        public string fecha { get; set; }
        public string hora { get; set; }
        public int usuarioIdGenero { get; set; }
        public string usuarioGenero { get; set; }
        public List<GastoDetalle> gastoDetalle {get;set; }
    }

    public class GastoDetalle
    {
        public int gastoId { get; set; }
        public int consecutivoId { get; set; }
        public int comprobanteTipoId { get; set; }
        public string comprobanteTipo { get; set; }
        public string fecha { get; set; }
        public int conceptoId { get; set; }
        public string concepto { get; set; }
        public int subConceptoId { get; set; }
        public string subConcepto { get; set; }
        public string descripcion { get; set; }
        public string proveedor { get; set; }
        public decimal subTotal { get; set; }
        public decimal iva { get; set; }
        public decimal total { get; set; }
    }

}