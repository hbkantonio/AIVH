<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%Response.CharSet = "utf-8"%>

<!--#include file="inc/Database.asp"-->
<!--#include file="inc/freeaspupload.asp" -->
<!DOCTYPE html>
<html lang="es">
<!--[if IE 7 ]>		 <html class="no-js ie ie7 lte7 lte8 lte9" lang="en-US"> <![endif]-->
<!--[if IE 8 ]>		 <html class="no-js ie ie8 lte8 lte9" lang="en-US"> <![endif]-->
<!--[if IE 9 ]>		 <html class="no-js ie ie9 lte9>" lang="en-US"> <![endif]-->

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<style type="text/css">
    <!--
    .Estilo1 {
        font-size: 12px;
        color: #751919;
    }
    -->
</style>

<title>Expedientes</title>

    <link href="inc/sare.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="themes/base/jquery.ui.all.css">
	<script src="js/jquery-1.8.3.js"></script>
	<script src="js/jquery.bgiframe-2.1.2.js"></script>
	<script src="js/jquery.ui.core.js"></script>
	<script src="js/jquery.ui.widget.js"></script>
	<script src="js/jquery.ui.mouse.js"></script>
	<script src="js/jquery.ui.datepicker.js"></script>
	<script src="js/jquery.ui.button.js"></script>
	<script src="js/jquery.ui.draggable.js"></script>
	<script src="js/jquery.ui.position.js"></script>
	<script src="js/jquery.ui.resizable.js"></script>
	<script src="js/jquery.ui.dialog.js"></script>
	<script src="js/jquery.ui.effect.js"></script>
	<script src="js/jquery.ui.menu.js"></script>
	<script src="js/jquery.ui.autocomplete.js"></script>
    <script src="js/jquery.dataTables.min.js" type="text/javascript"></script>
    <!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/x.x.x/jquery.min.js"></script>-->
    <script src="js/jquery.bpopup.min.js"></script>
	<script src="js/jquery.ui.tooltip.js"></script>
    <link rel="stylesheet" href="css/demos.css">
	<script src="jquery.msgBox/jquery.msgBox.js" type="text/javascript"></script>
	<link href="jquery.msgBox/msgBoxLight.css" rel="stylesheet" type="text/css" />
	<script src="js/jquery.blockUI.js"></script>

</head>

<%

vlUsuario = session("usuario")
'response.Write session("usuario")
'response.End()

if vlUsuario = "" then
	Response.Write "<script>top.location='http://172.16.1.204/ymca/login.asp?reingreso=1'</script>"
	Response.End
end if


vlAsociacion = 1
vlUnidad = request("slUnidad")
IF vlUnidad = "" Then
   vlUnidad = request("idUnidad")
End if

idFolio = request("Folio")
idFolioUnidad = ""
strAsociacion = ""
strUnidad = ""
strFecha = ""
idUsuario = 0
strTipoUsuario = ""
strNombre = ""
strDescrpcion = ""
idInfraccion = 0
idResolucion = 0
strFechaIni = ""
strFechaFin = ""
strDoctoPDF = ""
idEstatus = 0
strFechaConcluido = ""


strSql = "EXEC COMISIONUC.DBO.SPS_FOLIO " & idFolio
'response.Write strSql
Set RsAdo = rsCon.execute(StrSql)
if  not RsAdo.eof then
    idFolioUnidad = RsAdo("FIFOLIOUNIDAD")
		strAsociacion = RsAdo("FCTITULO1")
		strUnidad = RsAdo("FCASOCIACION")
		strFecha = RsAdo("FDFECHA")
		idUsuario = RsAdo("FIUSUARIO")
		strTipoUsuario = RsAdo("FCPLAN")
		strNombre = RsAdo("FCNOMBRE")
		strDescrpcion = RsAdo("FCDESCRIPCION")
		idInfraccion = RsAdo("FIINFRACCION")
		idResolucion = RsAdo("FITIPO_RESOLUCION")
		strFechaIni = RsAdo("FDFECHAINI")
		strFechaFin = RsAdo("FDFECHAFIN")
		idEstatus =  RsAdo("FIESTATUS")
		vlArchivosAnexados = RsAdo("ArchivosAnexados")
		'strDoctoPDF = RsAdo("FIDOCTO_PDF")
		strFechaConcluido = RsAdo("FDFECHA_CONCLUIDO")
		idResolucion2 = RsAdo("FITIPO_RESOLUCION2")
		strFechaIni2 = RsAdo("FDFECHAINI2")
		strFechaFin2 = RsAdo("FDFECHAFIN2")


		set RsAdo = Nothing

end if


'response.Write "strDoctoPDF" & strDoctoPDF & "FIN"
'response.End
%>

<body>
<form id='frmMain' name='frmMain' action="" method='post' enctype="multipart/form-data" >
  <table  width="1024" border="0">
  <tr class="a">
    <th colspan="6" scope="row">
    <table width="800" border="0">
      <tr>
        <td width="116"><strong><a href="javascript:return false;" id="aRegresar" ><img src="images/FleReg1.png" alt='Regresar al Men&uacute; de Opciones' name="regresar" id="regresar" width="60" height="28" border="0"></a> </strong></td>
        <td width="554"><div align="center"><strong><img src="images/bullet.gif" width="16" height="12"><span class="Estilo1">Seguimiento Expediente de Comisi&oacute;n de Usuarios y Conducta</span></strong></div></td>
        <td width="116">&nbsp;</td>
      </tr>
    </table>
    <p><strong></strong></p>
    <table width="900" border="0">
      <tr>
        <th width="40" scope="col"></th>
        <th width="819" scope="col"> <table width="781" border="0">
            <tr>
              <td class="menu_activo"><div align="right">Folio: </div></td>
              <td colspan="2" class="submenu2"><div align="left"><%=idFolioUnidad%> </div></td>
            </tr>
            <tr>
              <td class="menu_activo"><div align="right">Asociaci&oacute;n: </div></td>
              <td colspan="2" class="submenu2"><div align="left"><%=strAsociacion%></div></td>
            </tr>
            <tr>
              <td class="menu_activo"><div align="right">Unidad: </div></td>
              <td colspan="2" class="submenu2"><div align="left"><%=strUnidad%></div></td>
            </tr>
            <tr>
              <td width="221" class="menu_activo"><div align="right">Fecha de apertura: </div></td>
              <td width="550" colspan="2" class="submenu2"><div align="left"><%=FormatDateTime(strFecha,vbLongDate)%></div></td>
            </tr>
            <tr>
              <td align="right" class="menu_activo"><div align="right">Usuario:</div></td>
              <td colspan="2"><div align="left">
                  <input type="text" name="txtUsuario" id="txtUsuario" value="<%=idUsuario%>" disabled>
                </div></td>
            </tr>
            <tr>
              <td class="menu_activo"><div align="right">Tipo Usuario: </div></td>
              <td colspan="2"><div align="left">
                  <input name="txtPlan" type="text" id="txtPlan" size="15" maxlength="15" value="<%=strTipoUsuario%>" disabled>
                </div></td>
            </tr>
            <tr>
              <td class="menu_activo"><div align="right">Nombre:</div></td>
              <td colspan="2"><div align="left">
                  <input name="txtNombre" type="text" id="txtNombre" size="80" maxlength="80" value="<%=strNombre%>" disabled>
                </div></td>
            </tr>
            <tr>
              <td class="menu_activo"><div align="right">Descripci&oacute;n Corta:</div></td>
              <td colspan="2"><div align="left">
                  <input name="txtDescripcion" type="text" id="txtDescripcion" size="80" maxlength="80" value="<%=strDescrpcion%>" <%if idEstatus = 3 then response.write "disabled"  end if %>>
                </div></td>
            </tr>
						<!--<tr>
							<td class="menu_activo"><div align="right">Articulos:</div></td>
							<td colspan="2"><div align="left">
						<select name="slArticulo" id="slArticulo">
							    <option value="0">Seleccione Articulo . . .</option>
							    <%
							    StrSql = "EXEC COMISIONUC..SPS_ARTICULO "
							    Set RsAdo = rsCon.execute(StrSql)

							    Do While not RsAdo.eof
							    %>
							    <option value="<%=RsAdo(0)%>"><%=RsAdo(1)%></option>
							    <%
							    RsAdo.movenext
							    loop
							    set RsAdo = Nothing%>
							</select>
						<input name="txtObservaciones" type="text" id="txtObservaciones" size="50" maxlength="50" value="">
						<div style:""><input type="button" name="btnAgregar" id="btnAgregar" value="Agregar" onclick="Agregar()"></div>
							<table width="500" border="1">
							    <tbody>
							        <tr class="menu_opciones2">
							            <th width="100" scope="row">Articulo</th>
							            <th width="400">Observaciones</th>
							        </tr>
							        <tr>
							            <th></th>
							            <th></th>
							        </tr>
							    </tbody>
							</table>

								</div></td>

						</tr>-->
            <tr>
              <td class="menu_activo"><div align="right">Categor&iacute;a de infracci&oacute;n:</div></td>
              <td colspan="2"><div align="left">
                  <select name="slInfraccion" id="slInfraccion" <%if idEstatus = 3 then response.write "disabled"  end if %>>
                    <option value="0">Seleccione el Nivel de Infracción . . .</option>
                    <%

            StrSql = "EXEC COMISIONUC..SPS_INFRACCION "
			Set RsAdo = rsCon.execute(StrSql)


			Do While not RsAdo.eof
			%>
                    <option value="<%=RsAdo(0)%>" <%if cint(idInfraccion) = RsAdo(0) then response.Write "selected" end if %>><%=RsAdo(1)%></option>
                    <%
            RsAdo.movenext
		    loop
			set RsAdo = Nothing%>
                  </select>
                </div></td>
            </tr>
              <tr>

            <td class="menu_activo"><div align="right">Resoluci&oacute;n:</div></td>
            <td><div align="left">
                <select name="slResolucion" id="slResolucion" <%if idEstatus = 3 then response.write "disabled"  end if %>>
                  <option value="0" >Seleccione el tipo de resolución . . .</option>
                  <%

            StrSql = "EXEC COMISIONUC..SPS_TIPO_RESOLUCION "
			Set RsAdo = rsCon.execute(StrSql)


			Do While not RsAdo.eof
			%>
                  <option value="<%=RsAdo(0)%>" <%if cint(idResolucion) = RsAdo(0) then response.Write "selected" end if %>><%=RsAdo(1)%></option>
                  <%
            RsAdo.movenext
		    loop
			set RsAdo = Nothing%>
                </select>
              </div></td>

              <td>
              <div align="left" id="divSegundaResolucion" style="display: none;" >
              <select name="slResolucion2" id="slResolucion2" <%if idEstatus = 3 then response.write "disabled"  end if %>>
              </select>
              </div>
              </td>
              </tr>
                <tr>
                <td class="menu_activo"><div align="right">Fecha inicial de la resoluci&oacute;n:</div></td>
                <td><div align="left"><input name="txtFechaIni" type="text" id="txtFechaIni" size="10" maxlength="10" value="<%=strFechaIni%>"  <%if idEstatus = 3 then response.write "disabled"  end if %>></div></td>
                <td><div align="left" id="divSegundaFechaIni" style="display: none;">
                <input name="txtFechaIni2" type="text" id="txtFechaIni2" size="10" maxlength="10" value="<%=strFechaIni2%>" <%if idEstatus = 3 then response.write "disabled"  end if %>></div> </td>
              </tr>
              <tr>
                <td class="menu_activo"><div align="right">Fecha final de la resoluci&oacute;n:</div></td>
                <td><div align="left">
                  <input name="txtFechaFin" type="text" id="txtFechaFin" size="10" maxlength="10" value="<%=strFechaFin%>"  <%if idEstatus = 3 then response.write "disabled"  end if %> >
                  <div id="divIndefinido" ></div>
                </div></td>
                <td><div align="left" id="divSegundaFechaFin" style="display: none;">
                  <input name="txtFechaFin2" type="text" id="txtFechaFin2" size="10" maxlength="10" value="<%=strFechaFin2%>"<%if idEstatus = 3 then response.write "disabled"  end if %> >
                </div></td>
              </tr>
            <%if idEstatus <> 3 THEN%>
              <tr>
                <td class="menu_activo"><div align="right">Anexar documento PDF:</div></td>
                <td colspan="2"><div align="left"><input id="attach1"  name="attach1" type="file" size="35"></div></td>
              </tr>
              <tr>
                <td class="menu_activo"><div align="right">Nombre de PDF que se esta anexando:</div></td>
                <td colspan="2"><div align="left">
                  <input name="txtDescPDF" type="text" id="txtDescPDF" size="50" maxlength="50" value="">
                  </div></td>
              </tr>
              <%END IF%>
              <tr>
                <td class="menu_activo"><div align="right">Documentos PDF Anexados:</div></td>
                <td colspan="2"><div align="left"><%IF strDoctoPDF <> "" THEN %><%vlArchivosAnexados=1%> <%END IF%>
                    <%
				    		strSQL = "EXEC COMISIONUC..SPS_FOLIO_DOCTO_PDF " & idFolio
							'response.Write  strSQL
							Set RsAdo2 = rsCon.execute(StrSql)

							do while not RsAdo2.eof%>
   <a id = "<%=RsAdo2("FIDOCTO_PDF")%>1" target="_blank" href="../../../DoctosPermisos/DoctosComision/<%=RsAdo2("FIDOCTO_PDF")%>"><img src="../../BaseIncluidos/images/pdf.jpg"  width="20" height="20" border="0"  title="<%=RsAdo2("FCNOMBRE_PDF")%>"></a>
   <%if idEstatus <> 3 THEN%>
   <a id="<%=RsAdo2("FIDOCTO_PDF")%>" class="eliminar"> <img   src="../../BaseIncluidos/images/error.png"  width="10" height="10" border="0"  title="Eliminar <%=RsAdo2("FCNOMBRE_PDF")%>"></a>
   <%end if%>
                               <%
                               RsAdo2.movenext
							loop
							set RsAdo2 = Nothing
				  %>
                </div></td>
              </tr>
              <%if idEstatus <> 3 THEN%>
                <tr>
                <td class="menu_activo"><div align="right">Nuevo comentario:</div></td>
                <td colspan="2"><textarea name='txtNota' maxlength='300' cols='80' rows='5' id='txtNota' ></textarea></td>
                </tr>
                <tr>
                <td>
                  <a  id="aActualizar" href=""><img src="images/Actualizar_1.png" name="btnActualizar" id="btnActualizar" border="0"></a>
                 </td>
                 <td colspan="2">&nbsp;
                 </td>
              </tr>
               <%end if%>
              <tr>
                <td colspan="3" ><div align="left"><div id="message-alerta" class="ui-widget"></div></td>
              </tr>
              <%If idEstatus = 3 then%>
              <tr>
                <td class="menu_activo"><div align="right">Fecha Concluido:</div></td>
                <td colspan="2"><div align="left">
                  <input name="txtFechaConcluido" type="text" id="txtFechaConcluido" size="10" maxlength="10" value="<%=strFechaConcluido%>"  disabled >
                </div></td>
              </tr>
              <%end if%>
              <tr>
                <td>&nbsp;</td>
                <td colspan="2">&nbsp;</td>
              </tr>
              <tr>
                <td colspan="3">
                  <table width="755" border="1">
                    <tr>
                      <th colspan="3" class="titulo_tabla" scope="col">SEGUIMIENTO</th>
                      </tr>
                    <tr class="menu_opciones2">
                      <th width="174" scope="row">Fecha</th>
                      <th width="229">Nombre</th>
                      <th width="330">Nota o Comentario</th>
                      </tr>
                    <%
				    		strSQL = "EXEC COMISIONUC..SPS_SEGUIMIENTO " & idFolio
							'response.Write  strSQL
							Set RsAdo2 = rsCon.execute(StrSql)

							do while not RsAdo2.eof%>
                    <tr>
                      <th><%=RsAdo2("FDSESION")%></th>
                      <th><%=RsAdo2("FCUSUARIO")%></th>
                      <th><div align="left"><%=RsAdo2("FCOBSERVACIONES")%></div></th>
                      </tr>
                    <%RsAdo2.movenext
							  loop
							  set RsAdo2 = Nothing
							  %>
                    </table>
                  </td>
              </tr>
              <tr>
                <td colspan="3"></td>
              </tr>
              <tr>
                <td colspan="3">&nbsp;</td>
              </tr>
              <tr>
                <td colspan="3">&nbsp;</td>
              </tr>
              <tr>
                <td colspan="3">&nbsp;</td>
              </tr>
              <tr>
                <td colspan="3"><div align="left"><%if idEstatus <> 3 THEN%>
                <a id="aCerrar" href="" ><img src="images/Concluir_1.png" name="btnCerrar" id="btnCerrar" border="0"></a>
				<%end if%></div></td>
              </tr>
              </table>
            </th>
                <th width="27" scope="col">&nbsp;</th>
        </tr>
          </table>

          <table width="900" border="0">
          <tr>
            <th colspan="3" scope="col"></th>
            <th scope="col">&nbsp;</th>
          </tr>
          <tr>
            <th width="859" colspan="3" scope="col"></th>
            <th width="27" scope="col"></th>
          </tr>
        </table>

    <p>&nbsp;</p></th></tr>
    </table>

     <input type='hidden' name='idUnidad' id='idUnidad' value="<%=vlUnidad%>">
     <input type='hidden' name='idFolio' id='idFolio' value="<%=idFolio%>">
     <input type='hidden' name='vlMuestraNota' value='1'>
     <input type='hidden' name='ArchivosAnexados' id='ArchivosAnexados' value='<%=vlArchivosAnexados%>'>
     <input type='hidden' name='vlResolucion2' id='vlResolucion2' value='<%=idResolucion2%>'>
     <input type='hidden' name='vlFechaIni2' id='vlFechaIni2' value='<%=strFechaIni2%>'>
     <input type='hidden' name='vlFechaFin2' id='vlFechaFin2' value='<%=strFechaFin2%>'>
</form>
</body>
</html>
<script src="js/Expediente/ModificaExpediente.js"></script>
