using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppRendiciones.Models.DTO
{
   
    public class Menu
    {
        public Menu()
        {
            Submenus = new List<Submenu>();
        }
        
        public int menuId { get; set; }
        public string descripcion { get; set; }
        public string icono { get; set; }
        public List<Submenu> Submenus { get; set; }
    }

    public class Submenu
    {
        public int menuId { get; set; }
        public int submenuId { get; set; }
        public string descripcion { get; set; }
        public string link { get; set; }
    }

}