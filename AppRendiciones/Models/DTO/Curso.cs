using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace AppRendiciones.Models.DTO
{
    public class Curso
    {
        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        public string folio { get; set; }
        public int cursoId { get; set; }
        public int centroCostosId { get; set; }
        public string centroCostos { get; set; }
        public int sedeId { get; set; }
        public string sede { get; set; }
        public string lugarCurso { get; set; }
        public int cursoTipoId { get; set; }
        public string cursoTipo { get; set; }
        public int instructorId1 { get; set; }
        public string instructor1 { get; set; }
        public int comision1 { get; set; }
        public int instructorId2 { get; set; }
        public string instructor2 { get; set; }
        public int comision2 { get; set; }
        public string fechaCurso { get; set; }
        private DateTime fechaCurso1 { get; set; }
        public DateTime fechaCurso2
        {
            get { return fechaCurso1; }
            set { fechaCurso = value.ToString("dd/MM/yyyy", Cultura); }
        }
        public decimal anticipo { get; set; }
        public decimal efectivo { get; set; }
        public decimal chequeTans { get; set; }
        public string fechachequeTans { get; set; }
        public string numeroChequeTans { get; set; }
        public string estatus { get; set; }
        public int estatusId { get; set; }
        public string usuarioGenero { get; set; }
        public List<Participante> participantes { get; set; }
        public List<CursoGastoDetalle> gastos { get; set; }
    }


    public class Participante
    {
        public int cursoId { get; set; }
        public int participanteId { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public decimal efectivo { get; set; }
        public decimal deposito { get; set; }
        public decimal cheque { get; set; }
        public decimal tarjeta { get; set; }
        public string email { get; set; }
        public string celular { get; set; }
    }


    public class CursoGastoDetalle
    {

        static CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
        public int cursoId { get; set; }
        public int consecutivoId { get; set; }
        public int instructorId { get; set; }
        public string instructor { get; set; }
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