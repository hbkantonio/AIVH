using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DTO
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string NickName { get; set; }
        public string Password { get; set; }
        public string Nombre { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string UId { get; set; }
    }

}