//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AppRendiciones.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Evento
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Evento()
        {
            this.EventoDonante = new HashSet<EventoDonante>();
            this.EventoGastoDetalle = new HashSet<EventoGastoDetalle>();
        }
    
        public int EventoId { get; set; }
        public int CentroCostoId { get; set; }
        public string LugarEvento { get; set; }
        public string NombreEvento { get; set; }
        public int EventoTipoId { get; set; }
        public int UsuarioId { get; set; }
        public System.DateTime FechaEvento { get; set; }
        public decimal Efectivo { get; set; }
        public decimal ChequeTans { get; set; }
        public Nullable<System.DateTime> FechasChequeTans { get; set; }
        public string NumeroChequeTans { get; set; }
        public System.DateTime Fecha { get; set; }
        public System.TimeSpan Hora { get; set; }
        public int UsuarioIdGenero { get; set; }
        public int EstatusId { get; set; }
    
        public virtual CentroCosto CentroCosto { get; set; }
        public virtual Estatus Estatus { get; set; }
        public virtual EventoTipo EventoTipo { get; set; }
        public virtual Usuario Usuario { get; set; }
        public virtual Usuario Usuario1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EventoDonante> EventoDonante { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EventoGastoDetalle> EventoGastoDetalle { get; set; }
    }
}
