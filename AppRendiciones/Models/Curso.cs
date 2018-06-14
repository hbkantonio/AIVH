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
    
    public partial class Curso
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Curso()
        {
            this.CursoGastoDetalle = new HashSet<CursoGastoDetalle>();
            this.CursoParticipante = new HashSet<CursoParticipante>();
        }
    
        public int CursoId { get; set; }
        public int CentroCostoId { get; set; }
        public int SedeId { get; set; }
        public string LugarCurso { get; set; }
        public int CursoTipoId { get; set; }
        public int UsuarioId1 { get; set; }
        public int Comision1 { get; set; }
        public int UsuarioId2 { get; set; }
        public int Comision2 { get; set; }
        public System.DateTime FechaCurso { get; set; }
        public decimal Efectivo { get; set; }
        public decimal ChequeTans { get; set; }
        public Nullable<System.DateTime> FechasChequeTans { get; set; }
        public string NumeroChequeTans { get; set; }
        public System.DateTime Fecha { get; set; }
        public System.TimeSpan Hora { get; set; }
        public int UsuarioIdGenero { get; set; }
        public int EstatusId { get; set; }
    
        public virtual CentroCosto CentroCosto { get; set; }
        public virtual CursoTipo CursoTipo { get; set; }
        public virtual Estatus Estatus { get; set; }
        public virtual Sede Sede { get; set; }
        public virtual Usuario Usuario { get; set; }
        public virtual Usuario Usuario1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CursoGastoDetalle> CursoGastoDetalle { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CursoParticipante> CursoParticipante { get; set; }
    }
}
