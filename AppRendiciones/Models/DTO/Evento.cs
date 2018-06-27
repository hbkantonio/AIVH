using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace AppRendiciones.Models.DTO
{
    public class Evento
    {
        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        public string folio { get; set; }
        public int eventoId { get; set; }
        public int centroCostosId { get; set; }
        public string centroCostos { get; set; }
        public string lugarEvento { get; set; }
        public string nombreEvento { get; set; }
        public int eventoTipoId { get; set; }
        public string eventoTipo { get; set; }
        public int instructorId { get; set; }
        public string instructor { get; set; }
        public string fechaEvento { get; set; }
        private DateTime fechaEvento1 { get; set; }
        public DateTime fechaEvento2
        {
            get { return fechaEvento1; }
            set { fechaEvento = value.ToString("dd/MM/yyyy", Cultura); }
        }
        public decimal anticipo { get; set; }
        public decimal efectivo { get; set; }
        public decimal chequeTans { get; set; }
        public string fechachequeTans { get; set; }
        public string numeroChequeTans { get; set; }
        public string estatus { get; set; }
        public int estatusId { get; set; }
        public string usuarioGenero { get; set; }
        public List<Donantes> donantes { get; set; }
        public List<EventoGastoDetalle> gastos { get; set; }
        public string totalRecaudado { get; set; }
        public string totalGastos { get; set; }
        public decimal totalGastosD { get; set; }
        public string saldo { get; set; }
        public string observaciones { get; set; }
    }


    public class Donantes
    {
        public int eventoId { get; set; }
        public int donanteId { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public decimal efectivo { get; set; }
        public decimal deposito { get; set; }
        public decimal cheque { get; set; }
        public decimal tarjeta { get; set; }
        public string email { get; set; }
        public string celular { get; set; }
    }


    public class EventoGastoDetalle
    {

        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        public int eventoId { get; set; }
        public int consecutivoId { get; set; }
        public int comprobanteTipoId { get; set; }
        public string comprobanteTipo { get; set; }
        public string fecha { get; set; }
        private DateTime fecha1 { get; set; }
        public DateTime fecha2
        {
            get { return fecha1; }
            set { fecha = value.ToString("dd/MM/yyyy", Cultura); }
        }
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