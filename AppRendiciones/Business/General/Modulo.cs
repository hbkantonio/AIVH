using AppRendiciones.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppRendiciones.Business.General
{
    public class Modulo
    {

        public static List<Models.DTO.Menu> Get(AIVHEntities db, int usuarioId)
        {
            List<Models.DTO.Menu> Menus = new List<Models.DTO.Menu>();

            int usuarioRol = db.Usuario
                .Where(x => x.UsuarioId == usuarioId)
                .FirstOrDefault().UsuarioRolId;

            var rolAcceso = db.UsuarioRolAcceso
                .Where(x => x.UsuarioRolId == usuarioRol
                && x.SubMenu.EstatusId == 1).Select(a => new
                {
                    a.SubMenu.MenuId,
                    a.SubMenuId
                }).ToList();

            var menus = rolAcceso.GroupBy(x => new { x.MenuId })
                .Select(g => new { g.Key.MenuId }).ToList();

            var submenus = rolAcceso.GroupBy(x => new { x.MenuId, x.SubMenuId })
                .Select(g => new { g.Key.MenuId, g.Key.SubMenuId }).ToList();

            menus.ForEach(x =>
            {
                var aux = db.Menu
                .Where(k => k.MenuId == x.MenuId).SingleOrDefault();

                var menu = new Models.DTO.Menu
                {
                    menuId = x.MenuId,
                    descripcion = aux.Descripcion,
                    icono = aux.Icono
                };
                
                var saux = submenus.Where(p =>  p.MenuId == x.MenuId).ToList();

                saux.ForEach(p =>
                {
                    menu.Submenus
                     .Add(aux.SubMenu
                     .Where(k => k.SubMenuId == p.SubMenuId)
                     .Select(k => new Models.DTO.Submenu
                     {
                         menuId = k.MenuId,
                         submenuId = k.SubMenuId,
                         descripcion = k.Descripcion,
                         link = k.Link
                     }).FirstOrDefault());
                });
                Menus.Add(menu);
            });

            return Menus;
        }
    }
}