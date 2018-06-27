<%@ Language=VBScript %>
<!--#include file="inc/Database.asp"-->
<!--#include file="inc/freeaspupload.asp" -->
<!doctype html>
<!--[if IE 7 ]>		 <html class="no-js ie ie7 lte7 lte8 lte9" lang="en-US"> <![endif]-->
<!--[if IE 8 ]>		 <html class="no-js ie ie8 lte8 lte9" lang="en-US"> <![endif]-->
<!--[if IE 9 ]>		 <html class="no-js ie ie9 lte9>" lang="en-US"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="no-js" lang="en-US"> <!--<![endif]-->

<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<style type="text/css">
<!--
.Estilo1 {	font-size: 12px;
	color: #751919;
}
-->
</style>
<script type="text/javascript">
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
</script>
<strong><strong></strong></strong>
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






	<script>

	$(function() {


		$("#txtFechaIni").datepicker({
		minDate: null,
		maxDate: null
		});


		$("#txtFechaFin").datepicker({
		minDate: null,
		maxDate: null
		});

		$("#txtFechaIni2").datepicker({
		minDate: null,
		maxDate: null
		});


		$("#txtFechaFin2").datepicker({
		minDate: null,
		maxDate: null
		});






	});

	$(document).ready(function(){


			$('#chkIndefinido').change(function() {
				if($(this).is(":checked")) {
					$('#txtFechaFin').val("31/12/9999");
					$('#txtFechaFin').attr("disabled", true);
				}
				else
				{
				 $('#txtFechaFin').val("");
				 $('#txtFechaFin').attr("disabled", false);
				}

			});


		if( $("#slResolucion").val() == 3 || $("#slResolucion").val() == 4 || $("#slResolucion").val() == 6){
			$("#divSegundaResolucion").css("display", "block");
			$("#divSegundaFechaIni").css("display", "block");
			$("#divSegundaFechaFin").css("display", "block");
			LlenaResolucion($("#slResolucion").val(), $("#vlResolucion2").val() );

			 $("#txtFechaIni2").val( $("#vlFechaIni2").val() );
			 $("#txtFechaFin2").val( $("#vlFechaFin2").val() );

		}

		$("#slResolucion").change(function () {
			    var FechaHoy = new Date();

				var d = new Date();
				var month = d.getMonth()+1;
				var day = d.getDate();
				var output = (day<10 ? '0' : '') + day + '/' +
					         (month<10 ? '0' : '') + month + '/' +
				             d.getFullYear();

				var TipoResolucion = this.value;

				//$( "#divIndefinido").attr("class", "");
				//$( "#divIndefinido").html( "" );

				if(TipoResolucion == 0 ){
					$('#txtFechaIni').val("");
					$('#txtFechaFin').val("");
					$('#txtFechaIni').attr("disabled", true);
					$('#txtFechaFin').attr("disabled", true);


					$("#divSegundaResolucion").css("display", "none");
					$("#divSegundaFechaIni").css("display", "none");
					$("#divSegundaFechaFin").css("display", "none");

				}

				if(TipoResolucion == 1 ){
					$('#txtFechaIni').val(output);
					$('#txtFechaFin').val(output);
					$('#txtFechaIni').attr("disabled", true);
					$('#txtFechaFin').attr("disabled", true);

					$("#divSegundaResolucion").css("display", "none");
					$("#divSegundaFechaIni").css("display", "none");
					$("#divSegundaFechaFin").css("display", "none");

				}

				if(TipoResolucion == 2 ){
					$('#txtFechaIni').val(output);
					$('#txtFechaFin').val(output);
					$('#txtFechaIni').attr("disabled", true);
					$('#txtFechaFin').attr("disabled", true);

					$("#divSegundaResolucion").css("display", "none");
					$("#divSegundaFechaIni").css("display", "none");
					$("#divSegundaFechaFin").css("display", "none");

				}


				if(TipoResolucion == 3 ){
					$('#txtFechaIni').val("");
					$('#txtFechaFin').val("");

					$('#txtFechaIni').attr("disabled", false);
					$('#txtFechaFin').attr("disabled", false);

					$('#txtFechaIni2').val("");
					$('#txtFechaFin2').val("");

					LlenaResolucion(TipoResolucion,0);
					$("#divSegundaResolucion").css("display", "block");
					$("#divSegundaFechaIni").css("display", "block");
					$("#divSegundaFechaFin").css("display", "block");

				}

				if(TipoResolucion == 4 ){
					$('#txtFechaIni').val("");
					$('#txtFechaFin').val("");


					$('#txtFechaIni').attr("disabled", false);
					$('#txtFechaFin').attr("disabled", false);

					$('#txtFechaIni2').val("");
					$('#txtFechaFin2').val("");

					LlenaResolucion(TipoResolucion,0);
					$("#divSegundaResolucion").css("display", "block");
					$("#divSegundaFechaIni").css("display", "block");
					$("#divSegundaFechaFin").css("display", "block");
				}


				if(TipoResolucion == 5 ){

					//$( "#divIndefinido").attr("class", "ui-state-error");
					//$( "#divIndefinido" ).html( "<input type='checkbox' name='chkIndefinido' id='chkIndefinido'> Indefinido. " );

					$('#txtFechaIni').val(output);
					$('#txtFechaFin').val("31/12/9999");
					$('#txtFechaIni').attr("disabled", false);
					$('#txtFechaFin').attr("disabled", true);

					$('#chkIndefinido').attr("disabled", true);

					$("#divSegundaResolucion").css("display", "none");
					$("#divSegundaFechaIni").css("display", "none");
					$("#divSegundaFechaFin").css("display", "none");
				}

				if(TipoResolucion == 6 ){
					$('#txtFechaIni').val("");
					$('#txtFechaFin').val("");

					$('#txtFechaIni').attr("disabled", false);
					$('#txtFechaFin').attr("disabled", false);

					$('#txtFechaIni2').val("");
					$('#txtFechaFin2').val("");

					$("#divSegundaResolucion").css("display", "block");
					$("#divSegundaFechaIni").css("display", "block");
					$("#divSegundaFechaFin").css("display", "block");
					LlenaResolucion(TipoResolucion,0);
				}



		});

		   function Alerta(strMensaje) {
			    $("#message-alerta").html("");
			    $("#message-alerta").prepend('<div id="mensaje_error" class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alerta:</strong> '+ strMensaje +' .</p></div>');
				$("#message-alerta").slideDown('slow');
				setTimeout(function(){
						$("#mensaje_error").slideUp(750);
						},6000);
		   }

		function LlenaResolucion(strResolucion,strResolucion2){

				$.ajax({
				 type: "POST",
				 url: "Asincrono/SegundaResolucion.asp",
				 data: "Resolucion="+strResolucion+"&Resolucion2="+strResolucion2,
				 cache: false,
				 success: function(html) {
				 $("#slResolucion2").html( html )
				 //$("#txtFechaIni2").val( '' );
				 //$("#txtFechaFin2").val( '' );
				 }
				});
		}


		 $("#btnGuardar").click(function(evento){



			$.msgBox({
			title: "Expedientes Comisi�n de Usuarios y Conducta",
			content: "� Desea actualizar el expediente ?",
			type: "confirm",
			buttons: [{ value: "Yes" }, { value: "No" }],
			success: function (result) {
				if (result == "Yes") {

					idFolio = $("#idFolio").val();
					txtUnidad  = $("#idUnidad").val();
					txtUsuario = $("#txtUsuario").val();
					txtInfraccion = $("#slInfraccion").val();
					txtResolucion = $("#slResolucion").val();

					txtFechaIni = $("#txtFechaIni").val();
					txtFechaFin = $("#txtFechaFin").val();

					vlObservaciones = "";
					if ( $("#txtNota").length > 0 ) {
  						vlObservaciones = $("#txtNota").val();
					}

					txtDescripcion = $("#txtDescripcion").val();
					strAttach = $("#attach1").val();

					$.blockUI({ message: "<h1> Procesando expediente...</h1>" });
					document.frmMain.action = "CargaPDF/CargaDocumento.asp?txtUnidad="+txtUnidad+"&txtUsuario="+txtUsuario+"&txtInfraccion="+txtInfraccion+"&txtResolucion="+txtResolucion+"&txtFechaIni="+txtFechaIni+"&txtFechaFin="+txtFechaFin+"&txtDescripcion="+txtDescripcion+"&attach1="+strAttach+"&idFolio="+idFolio+"&txtNota="+vlObservaciones;
					document.frmMain.submit();
				} // end if
			  } //function (result)
			}); // end msgbox

		   });



		 $("#btnCerrar").click(function(evento){
//SALOME

			if($("#txtDescripcion").val().length < 1) {
				Alerta('Capture una descripci�n corta y clara de la sanci�n');
				$("#txtDescripcion").focus();
				return false;
			}

			if($("#slInfraccion").val() == 0) {
				Alerta('Seleccione un tipo de Infracci�n');
				$("#slInfraccion").focus();
				return false;
			}


			if($("#slResolucion").val() == 0) {
					Alerta('Seleccione un tipo de Resoluci�n');
					$("#slResolucion").focus();
					return false;
				}

			if($("#txtFechaIni").val().length < 1) {
					Alerta('Capture la fecha de inicio');
					$("#txtFechaIni").focus();
					return false;
			}

			if($("#txtFechaFin").val().length < 1) {
					Alerta('Capture la fecha final');
					$("#txtFechaFin").focus();
					return false;
			}


			if ( $("#ArchivosAnexados").val() == "0"){
				     Alerta('Debe anexar por lo menos un archivo PDF.');
					 return false;
			  }


				$.msgBox({
				title: "Expedientes Comisi�n de Usuarios y Conducta",
				content: "� Desea Concluir y Cerrar Definitivamente el Expediente ?",
				type: "confirm",
				buttons: [{ value: "Yes" }, { value: "No" }],
				success: function (result) {
					if (result == "Yes") {

						idFolio = $("#idFolio").val();
						txtUnidad  = $("#idUnidad").val();
						txtUsuario = $("#txtUsuario").val();
						txtDescripcion = $("#txtDescripcion").val();
						txtInfraccion = $("#slInfraccion").val();
						txtResolucion = $("#slResolucion").val();

						txtFechaIni = $("#txtFechaIni").val();
						txtFechaFin = $("#txtFechaFin").val();

						strAttach = $("#attach1").val();

						$.blockUI({ message: "<h1> Procesando expediente...</h1>" });
						document.frmMain.action = "CargaPDF/CierraExpediente.asp?txtUnidad="+txtUnidad+"&txtUsuario="+txtUsuario+"&txtInfraccion="+txtInfraccion+"&txtResolucion="+txtResolucion+"&txtFechaIni="+txtFechaIni+"&txtFechaFin="+txtFechaFin+"&txtDescripcion="+txtDescripcion+"&attach1="+strAttach+"&idFolio="+idFolio;
						document.frmMain.submit();
					} // end if
				  } //function (result)
				}); // end msgbox




		   });




       });

	</script>



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
<body onLoad="MM_preloadImages('images/BCom2.png','images/FleReg2.png')">
<form id='frmMain' name='frmMain' method='post' action="" enctype="multipart/form-data" >
  <table  width="1024" border="0">
  <tr class="a">
    <th colspan="6" scope="row">
    <table width="800" border="0">
      <tr>
        <td width="116"><strong><a href="javascript:Regresa();" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('regresar','','images/FleReg2.png',1)"><img src="images/FleReg1.png" alt='Regresar al Men&uacute; de Opciones' name="regresar" id="regresar" width="60" height="28" border="0"></a> </strong></td>
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
                  <input type="text" name="txtUsuario" id="txtUsuario" onBlur='BuscaUsuario()' value="<%=idUsuario%>" disabled>
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
						<tr>
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

						</tr>
            <tr>
              <td class="menu_activo"><div align="right">Categor&iacute;a de infracci&oacute;n:</div></td>
              <td colspan="2"><div align="left">
                  <select name="slInfraccion" id="slInfraccion" <%if idEstatus = 3 then response.write "disabled"  end if %>>
                    <option value="0">Seleccione el Nivel de Infracci�n . . .</option>
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
                  <option value="0" >Seleccione el tipo de resoluci�n . . .</option>
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
   <a id = "<%=RsAdo2("FIDOCTO_PDF")%>2" href="JavaScript:EliminarPdf('<%=RsAdo2("FIDOCTO_PDF")%>');" > <img src="../../BaseIncluidos/images/error.png"  width="10" height="10" border="0"  title="Eliminar <%=RsAdo2("FCNOMBRE_PDF")%>"></a>
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
                <td colspan="2"><textarea name='txtNota' maxlength='300' cols='80' rows='5' id='txtNota' onkeyup='return ismaxlength(this)'></textarea></td>
                </tr>
                <tr>
                <td>
                  <a href="JavaScript:Actualizar();" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('btnActualizar','','images/Actualizar_2.png',1)"><img src="images/Actualizar_1.png" name="btnActualizar" id="btnActualizar" border="0"></a>
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
                <a href="JavaScript:Concluir();" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('btnCerrar','','images/Concluir_2.png',1)"><img src="images/Concluir_1.png" name="btnCerrar" id="btnCerrar" border="0"></a>
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




<script LANGUAGE="javascript">



var message = "Copyright � YMCA.";
function click(e) {
	if (document.all) {
		if (event.button==2||event.button==3) {
			alert(message);
			return;
		}
	}
	if (document.layers) {
		if (e.which == 3) {
			alert(message);
			return;
		}
	}
}
if (document.layers) {
	document.captureEvents(Event.MOUSEDOWN);
}
document.onmousedown=click;

function ismaxlength(obj)
{
var mlength=obj.getAttribute? parseInt(obj.getAttribute("maxlength")) : ""
var vlTecla = window.event.keyCode
var vlAncho = document.frmMain.txtNota.value.length
//alert(vlAncho);
//alert(vlTecla);
if (obj.getAttribute && obj.value.length>mlength)
obj.value=obj.value.substring(0,mlength)

if (vlTecla == 219)
obj.value=obj.value.substring(0,vlAncho-1)

}

function Regresa()
{

 idUnidad = $("#idUnidad").val();
 document.frmMain.action = "Expedientes.asp?idUnidad="+idUnidad;
 document.frmMain.submit();
}


function BuscaUsuario()
{
		idUnidad = $("#idUnidad").val();
		idUsuario = $("#txtUsuario").val();


		$.ajax({
		 type: "POST",
		 url: "Asincrono/ConsultaPlan.asp",
		 data: "idUnidad="+idUnidad+"&idUsuario="+idUsuario,
		 cache: false,
		 success: function(html) {
		   $("#txtPlan").val(html);
		 }
		});


		$.ajax({
		 type: "POST",
		 url: "Asincrono/ConsultaUsuario.asp",
		 data: "idUnidad="+idUnidad+"&idUsuario="+idUsuario,
		 cache: false,
		 success: function(html) {
		   $("#txtNombre").val(html);
		 }
		});


}

function PresentaNota()

{


	if(document.frmMain.vlMuestraNota.value=="1")
	{


 		vlTabla = "<table width='200' border='0'>"
		vlTabla = vlTabla +  "<tr>"
		vlTabla = vlTabla +  "<th scope='col'><textarea name='txtNota' maxlength='300' cols='80' rows='5' id='txtNota' onkeyup='return ismaxlength(this)'></textarea></th>"
		vlTabla = vlTabla +  "</tr>"
		vlTabla = vlTabla +  "</table>"

		document.getElementById('DivComentario').innerHTML = vlTabla;
		document.frmMain.vlMuestraNota.value = 0;
	}

	document.frmMain.txtNota.focus();
	document.frmMain.txtNota.select();


 }

 function Grabar()
{

	if(document.frmMain.txtNota.value=="")
	{
	 alert('Debe ingresar un comentario');
	 return;
	}

	//document.getElementById('progress').style.visibility = 'visible';
	//document.getElementById('grabar').style.visibility = 'hidden';
	//document.getElementById('comentario').style.visibility = 'hidden';
	//document.body.style.cursor = 'wait';
	//document.frmMain.TipoMov.value="1"; // 1 = Graba, 2 = Cancela, 3 = Atendido, 4 = Cerrar
	//document.frmMain.target = "_blank"
	vlObservaciones = document.frmMain.txtNota.value;
	vlFolio = document.frmMain.idFolio.value;
	vlUnidad = document.frmMain.idUnidad.value;
	document.frmMain.action = "ModificaExpediente.asp?Graba=1&Folio="+vlFolio+"&txtNota="+vlObservaciones+"&idUnidad="+vlUnidad;
	document.frmMain.submit();

}

function Actualizar()
{

			strAttach = $("#attach1").val();
			posicion = strAttach.indexOf(',');
			if (posicion != -1)	  {
					Alerta('El nombre del archivo PDF contiene comas, por favor renombre el archivo y vuelva a anexarlo.');
					return false;
			  }
			if ( $("#attach1").val() != ""){
				var strNombreFile =  $("#attach1").val();
				strNombreFile = strNombreFile.substring(strNombreFile.length-3)
				if (strNombreFile.toUpperCase() != "PDF"){

					$("#message-alerta").html("");
					$("#message-alerta").prepend('<div id="mensaje_error" class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alerta:</strong> El archivo debe ser PDF.</p></div>');
					$("#message-alerta").slideDown('slow');
					setTimeout(function(){
							$("#mensaje_error").slideUp(750);
							},6000);

					$("#attach1").focus();
					return false;
				}


			if ( $("#txtDescPDF").val().length == 0 ) {

					$("#message-alerta").html("");
					$("#message-alerta").prepend('<div id="mensaje_error" class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alerta:</strong> Debe indicar una descripci�n para el documento PDF que est� anexando.</p></div>');
					$("#message-alerta").slideDown('slow');
					setTimeout(function(){
							$("#mensaje_error").slideUp(750);
							},6000);

					$("#txtDescPDF").focus();
					return false;


			}


			}


			$.msgBox({
			title: "Expedientes Comisi�n de Usuarios y Conducta",
			content: "� Desea actualizar el expediente ?",
			type: "confirm",
			buttons: [{ value: "Yes" }, { value: "No" }],
			success: function (result) {
				if (result == "Yes") {

					idFolio = $("#idFolio").val();
					txtUnidad  = $("#idUnidad").val();
					txtUsuario = $("#txtUsuario").val();
					txtInfraccion = $("#slInfraccion").val();

					txtResolucion = $("#slResolucion").val();
					txtFechaIni = $("#txtFechaIni").val();
					txtFechaFin = $("#txtFechaFin").val();

					txtResolucion2 = $("#slResolucion2").val();
					txtFechaIni2 = $("#txtFechaIni2").val();
					txtFechaFin2 = $("#txtFechaFin2").val();


					vlObservaciones = "";
					if ( $("#txtNota").length > 0 ) {
  						vlObservaciones = $("#txtNota").val();
					}

					txtDescripcion = $("#txtDescripcion").val();
					strAttach = $("#attach1").val();
					strDescPDF = $("#txtDescPDF").val();

					$.blockUI({ message: "<h1> Procesando expediente...</h1>" });
					document.frmMain.action = "CargaPDF/CargaDocumento.asp?txtUnidad="+txtUnidad+"&txtUsuario="+txtUsuario+"&txtInfraccion="+txtInfraccion+"&txtResolucion="+txtResolucion+"&txtFechaIni="+txtFechaIni+"&txtFechaFin="+txtFechaFin+"&txtDescripcion="+txtDescripcion+"&attach1="+strAttach+"&idFolio="+idFolio+"&txtNota="+vlObservaciones+"&strDescPDF="+strDescPDF+"&txtResolucion2="+txtResolucion2+"&txtFechaIni2="+txtFechaIni2+"&txtFechaFin2="+txtFechaFin2;
					document.frmMain.submit();
				} // end if
			  } //function (result)
			}); // end msgbox


}


function  EliminarPdf(documentoId)
{
 var DocumentoId =  documentoId.substring(0, documentoId.length-4);

$.msgBox({
			title: "Expedientes Comisi�n de Usuarios y Conducta",
			content: "� Seguro que desea  eliminar este documento ?",
			type: "confirm",
			buttons: [{ value: "Yes" }, { value: "No" }],
			success: function (result) {
				if (result == "Yes") {
                       $.ajax({
						type:'GET',
						url:"Asincrono/EliminarDocumento.asp?DocumentoId="+DocumentoId,
						dataType: "html",
						contentType: "application/x-www-form-urlencoded",
						cache : false,
						//data:cadena,
						beforeSend: function() {
							//$(".progress-bar").css("display","block");
							//mbe.presentation.progressBarSimulate();
						},
						success: function(data){
							//alert(data);
			              imagen = document.getElementById(documentoId+"1");
						  padre = imagen.parentNode;
						  padre.removeChild(imagen);

						  imagen1 = document.getElementById(documentoId+"2");
						  padre1 = imagen1.parentNode;
						  padre1.removeChild(imagen1);
						},
						async: false,
					 });// end $.ajax

				} // end if
			  } //function (result)
			}); // end msgbox






}


function Concluir()
{


			if($("#txtDescripcion").val().length < 1) {
				Alerta('Capture una descripci�n corta y clara de la sanci�n');
				$("#txtDescripcion").focus();
				return false;
			}

			if($("#slInfraccion").val() == 0) {
				Alerta('Seleccione un tipo de Infracci�n');
				$("#slInfraccion").focus();
				return false;
			}


			if($("#slResolucion").val() == 0) {
					Alerta('Seleccione un tipo de Resoluci�n');
					$("#slResolucion").focus();
					return false;
				}

			if($("#txtFechaIni").val().length < 1) {
					Alerta('Capture la fecha de inicio');
					$("#txtFechaIni").focus();
					return false;
			}

			if($("#txtFechaFin").val().length < 1) {
					Alerta('Capture la fecha final');
					$("#txtFechaFin").focus();
					return false;
			}


			if ( $("#ArchivosAnexados").val() == "0"){
				     Alerta('Debe anexar por lo menos un archivo PDF.');
					 return false;
			  }


				$.msgBox({
				title: "Expedientes Comisi�n de Usuarios y Conducta",
				content: "� Desea Concluir y Cerrar Definitivamente el Expediente ?",
				type: "confirm",
				buttons: [{ value: "Yes" }, { value: "No" }],
				success: function (result) {
					if (result == "Yes") {

						idFolio = $("#idFolio").val();
						txtUnidad  = $("#idUnidad").val();
						txtUsuario = $("#txtUsuario").val();
						txtDescripcion = $("#txtDescripcion").val();
						txtInfraccion = $("#slInfraccion").val();
						txtResolucion = $("#slResolucion").val();

						txtFechaIni = $("#txtFechaIni").val();
						txtFechaFin = $("#txtFechaFin").val();

						strAttach = $("#attach1").val();

						$.blockUI({ message: "<h1> Procesando expediente...</h1>" });
						document.frmMain.action = "CargaPDF/CierraExpediente.asp?txtUnidad="+txtUnidad+"&txtUsuario="+txtUsuario+"&txtInfraccion="+txtInfraccion+"&txtResolucion="+txtResolucion+"&txtFechaIni="+txtFechaIni+"&txtFechaFin="+txtFechaFin+"&txtDescripcion="+txtDescripcion+"&attach1="+strAttach+"&idFolio="+idFolio;
						document.frmMain.submit();
					} // end if
				  } //function (result)
				}); // end msgbox



}


</script>
