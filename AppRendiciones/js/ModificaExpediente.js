$(function () {
    var lstArticulos = [], message = "Copyright � YMCA.";
    var expedienteFn =
        {
            init() {
                $("body").load(this.MM_preloadImages('images/BCom2.png', 'images/FleReg2.png'));
                $("#aRegresar").click(this.Regresa);
                $("#aRegresar").on("mouseout", this.MM_swapImgRestore);
                $("#aRegresar").on("mouseover", function () { expedienteFn.MM_swapImage('regresar', '', 'images/FleReg2.png', 1); });
                $("#aActualizar").click(this.Actualizar);
                $("#aActualizar").on("mouseout", this.MM_swapImgRestore);
                $("#aActualizar").on("mouseover", function () { expedienteFn.MM_swapImage('btnActualizar', '', 'images/Actualizar_2.png', 1); });
                $("#aCerrar").click(this.Concluir);
                $("#aCerrar").on("mouseout", this.MM_swapImgRestore);
                $("#aCerrar").on("mouseover", function () { expedienteFn.MM_swapImage('btnCerrar', '', 'images/Concluir_2.png', 1); });
                document.onmousedown = expedienteFn.click;
                $("#txtUsuario").blur(this.BuscaUsuario);
                $("#txtNota").keyup(this.ismaxlength);
                $(".eliminar").on('click', this.EliminarPdf);

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

                $('#chkIndefinido').change(function () {
                    if ($(this).is(":checked")) {
                        $('#txtFechaFin').val("31/12/9999");
                        $('#txtFechaFin').attr("disabled", true);
                    }
                    else {
                        $('#txtFechaFin').val("");
                        $('#txtFechaFin').attr("disabled", false);
                    }
                });

                if ($("#slResolucion").val() == 3 || $("#slResolucion").val() == 4 || $("#slResolucion").val() == 6) {
                    $("#divSegundaResolucion").css("display", "block");
                    $("#divSegundaFechaIni").css("display", "block");
                    $("#divSegundaFechaFin").css("display", "block");
                    expedienteFn.LlenaResolucion($("#slResolucion").val(), $("#vlResolucion2").val());

                    $("#txtFechaIni2").val($("#vlFechaIni2").val());
                    $("#txtFechaFin2").val($("#vlFechaFin2").val());
                }

                $("#slResolucion").change(function () {
                    var FechaHoy = new Date();

                    var d = new Date();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    var output = (day < 10 ? '0' : '') + day + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        d.getFullYear();

                    var TipoResolucion = this.value;

                    //$( "#divIndefinido").attr("class", "");
                    //$( "#divIndefinido").html( "" );

                    if (TipoResolucion == 0) {
                        $('#txtFechaIni').val("");
                        $('#txtFechaFin').val("");
                        $('#txtFechaIni').attr("disabled", true);
                        $('#txtFechaFin').attr("disabled", true);


                        $("#divSegundaResolucion").css("display", "none");
                        $("#divSegundaFechaIni").css("display", "none");
                        $("#divSegundaFechaFin").css("display", "none");

                    }

                    if (TipoResolucion == 1) {
                        $('#txtFechaIni').val(output);
                        $('#txtFechaFin').val(output);
                        $('#txtFechaIni').attr("disabled", true);
                        $('#txtFechaFin').attr("disabled", true);

                        $("#divSegundaResolucion").css("display", "none");
                        $("#divSegundaFechaIni").css("display", "none");
                        $("#divSegundaFechaFin").css("display", "none");

                    }

                    if (TipoResolucion == 2) {
                        $('#txtFechaIni').val(output);
                        $('#txtFechaFin').val(output);
                        $('#txtFechaIni').attr("disabled", true);
                        $('#txtFechaFin').attr("disabled", true);

                        $("#divSegundaResolucion").css("display", "none");
                        $("#divSegundaFechaIni").css("display", "none");
                        $("#divSegundaFechaFin").css("display", "none");

                    }

                    if (TipoResolucion == 3) {
                        $('#txtFechaIni').val("");
                        $('#txtFechaFin').val("");

                        $('#txtFechaIni').attr("disabled", false);
                        $('#txtFechaFin').attr("disabled", false);

                        $('#txtFechaIni2').val("");
                        $('#txtFechaFin2').val("");

                        expedienteFn.LlenaResolucion(TipoResolucion, 0);
                        $("#divSegundaResolucion").css("display", "block");
                        $("#divSegundaFechaIni").css("display", "block");
                        $("#divSegundaFechaFin").css("display", "block");

                    }

                    if (TipoResolucion == 4) {
                        $('#txtFechaIni').val("");
                        $('#txtFechaFin').val("");


                        $('#txtFechaIni').attr("disabled", false);
                        $('#txtFechaFin').attr("disabled", false);

                        $('#txtFechaIni2').val("");
                        $('#txtFechaFin2').val("");

                        expedienteFn.LlenaResolucion(TipoResolucion, 0);
                        $("#divSegundaResolucion").css("display", "block");
                        $("#divSegundaFechaIni").css("display", "block");
                        $("#divSegundaFechaFin").css("display", "block");
                    }

                    if (TipoResolucion == 5) {

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

                    if (TipoResolucion == 6) {
                        $('#txtFechaIni').val("");
                        $('#txtFechaFin').val("");

                        $('#txtFechaIni').attr("disabled", false);
                        $('#txtFechaFin').attr("disabled", false);

                        $('#txtFechaIni2').val("");
                        $('#txtFechaFin2').val("");

                        $("#divSegundaResolucion").css("display", "block");
                        $("#divSegundaFechaIni").css("display", "block");
                        $("#divSegundaFechaFin").css("display", "block");
                        expedienteFn.LlenaResolucion(TipoResolucion, 0);
                    }



                });

                $("#btnGuardar").click(function (evento) {



                    $.msgBox({
                        title: "Expedientes Comisi�n de Usuarios y Conducta",
                        content: "� Desea actualizar el expediente ?",
                        type: "confirm",
                        buttons: [{ value: "Yes" }, { value: "No" }],
                        success: function (result) {
                            if (result == "Yes") {

                                idFolio = $("#idFolio").val();
                                txtUnidad = $("#idUnidad").val();
                                txtUsuario = $("#txtUsuario").val();
                                txtInfraccion = $("#slInfraccion").val();
                                txtResolucion = $("#slResolucion").val();

                                txtFechaIni = $("#txtFechaIni").val();
                                txtFechaFin = $("#txtFechaFin").val();

                                vlObservaciones = "";
                                if ($("#txtNota").length > 0) {
                                    vlObservaciones = $("#txtNota").val();
                                }

                                txtDescripcion = $("#txtDescripcion").val();
                                strAttach = $("#attach1").val();

                                $.blockUI({ message: "<h1> Procesando expediente...</h1>" });
                                document.frmMain.action = "CargaPDF/CargaDocumento.asp?txtUnidad=" + txtUnidad + "&txtUsuario=" + txtUsuario + "&txtInfraccion=" + txtInfraccion + "&txtResolucion=" + txtResolucion + "&txtFechaIni=" + txtFechaIni + "&txtFechaFin=" + txtFechaFin + "&txtDescripcion=" + txtDescripcion + "&attach1=" + strAttach + "&idFolio=" + idFolio + "&txtNota=" + vlObservaciones;
                                document.frmMain.submit();
                            } // end if
                        } //function (result)
                    }); // end msgbox

                });

                $("#btnCerrar").click(function (evento) {
                    //SALOME

                    if ($("#txtDescripcion").val().length < 1) {
                        expedienteFn.Alerta('Capture una descripción corta y clara de la sanción');
                        $("#txtDescripcion").focus();
                        return false;
                    }

                    if ($("#slInfraccion").val() == 0) {
                        expedienteFn.Alerta('Seleccione un tipo de Infracción');
                        $("#slInfraccion").focus();
                        return false;
                    }


                    if ($("#slResolucion").val() == 0) {
                        expedienteFn.Alerta('Seleccione un tipo de Resolución');
                        $("#slResolucion").focus();
                        return false;
                    }

                    if ($("#txtFechaIni").val().length < 1) {
                        expedienteFn.Alerta('Capture la fecha de inicio');
                        $("#txtFechaIni").focus();
                        return false;
                    }

                    if ($("#txtFechaFin").val().length < 1) {
                        expedienteFn.Alerta('Capture la fecha final');
                        $("#txtFechaFin").focus();
                        return false;
                    }


                    if ($("#ArchivosAnexados").val() == "0") {
                        expedienteFn.Alerta('Debe anexar por lo menos un archivo PDF.');
                        return false;
                    }


                    $.msgBox({
                        title: "Expedientes Comisi�n de Usuarios y Conducta",
                        content: "¿ Desea Concluir y Cerrar Definitivamente el Expediente ?",
                        type: "confirm",
                        buttons: [{ value: "Yes" }, { value: "No" }],
                        success: function (result) {
                            if (result == "Yes") {

                                idFolio = $("#idFolio").val();
                                txtUnidad = $("#idUnidad").val();
                                txtUsuario = $("#txtUsuario").val();
                                txtDescripcion = $("#txtDescripcion").val();
                                txtInfraccion = $("#slInfraccion").val();
                                txtResolucion = $("#slResolucion").val();

                                txtFechaIni = $("#txtFechaIni").val();
                                txtFechaFin = $("#txtFechaFin").val();

                                strAttach = $("#attach1").val();

                                $.blockUI({ message: "<h1> Procesando expediente...</h1>" });
                                document.frmMain.action = "CargaPDF/CierraExpediente.asp?txtUnidad=" + txtUnidad + "&txtUsuario=" + txtUsuario + "&txtInfraccion=" + txtInfraccion + "&txtResolucion=" + txtResolucion + "&txtFechaIni=" + txtFechaIni + "&txtFechaFin=" + txtFechaFin + "&txtDescripcion=" + txtDescripcion + "&attach1=" + strAttach + "&idFolio=" + idFolio;
                                document.frmMain.submit();
                            } // end if
                        } //function (result)
                    }); // end msgbox

                });

                if (document.layers) {
                    document.captureEvents(Event.MOUSEDOWN);
                }


            },
            MM_swapImgRestore: function () { //v3.0
                var i, x, a = document.MM_sr; for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
            },
            MM_preloadImages: function () { //v3.0
                var d = document; if (d.images) {
                    if (!d.MM_p) d.MM_p = new Array();
                    var i, j = d.MM_p.length, a = expedienteFn.MM_preloadImages.arguments; for (i = 0; i < a.length; i++)
                        if (a[i].indexOf("#") != 0) { d.MM_p[j] = new Image; d.MM_p[j++].src = a[i]; }
                }
            },
            MM_findObj: function (n, d) { //v4.01
                var p, i, x; if (!d) d = document; if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
                    d = parent.frames[n.substring(p + 1)].document; n = n.substring(0, p);
                }
                if (!(x = d[n]) && d.all) x = d.all[n]; for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
                for (i = 0; !x && d.layers && i < d.layers.length; i++) x = expedienteFn.MM_findObj(n, d.layers[i].document);
                if (!x && d.getElementById) x = d.getElementById(n); return x;
            },
            MM_swapImage: function () { //v3.0
                var i, j = 0, x, a = expedienteFn.MM_swapImage.arguments; document.MM_sr = new Array; for (i = 0; i < (a.length - 2); i += 3)
                    if ((x = expedienteFn.MM_findObj(a[i])) != null) { document.MM_sr[j++] = x; if (!x.oSrc) x.oSrc = x.src; x.src = a[i + 2]; }
            },
            Regresa() {
                idUnidad = $("#idUnidad").val();
                document.frmMain.action = "Expedientes.asp?idUnidad=" + idUnidad;
                document.frmMain.submit();
            },
            Concluir() {
                if ($("#txtDescripcion").val().length < 1) {
                    expedienteFn.Alerta('Capture una descripción corta y clara de la sanción');
                    $("#txtDescripcion").focus();
                    return false;
                }

                if ($("#slInfraccion").val() == 0) {
                    expedienteFn.Alerta('Seleccione un tipo de Infracción');
                    $("#slInfraccion").focus();
                    return false;
                }

                if ($("#slResolucion").val() == 0) {
                    expedienteFn.Alerta('Seleccione un tipo de Resolución');
                    $("#slResolucion").focus();
                    return false;
                }

                if ($("#txtFechaIni").val().length < 1) {
                    expedienteFn.Alerta('Capture la fecha de inicio');
                    $("#txtFechaIni").focus();
                    return false;
                }

                if ($("#txtFechaFin").val().length < 1) {
                    expedienteFn.Alerta('Capture la fecha final');
                    $("#txtFechaFin").focus();
                    return false;
                }

                if ($("#ArchivosAnexados").val() == "0") {
                    expedienteFn.Alerta('Debe anexar por lo menos un archivo PDF.');
                    return false;
                }

                $.msgBox({
                    title: "Expedientes Comisión de Usuarios y Conducta",
                    content: "¿ Desea Concluir y Cerrar Definitivamente el Expediente ?",
                    type: "confirm",
                    buttons: [{ value: "Yes" }, { value: "No" }],
                    success: function (result) {
                        if (result == "Yes") {

                            idFolio = $("#idFolio").val();
                            txtUnidad = $("#idUnidad").val();
                            txtUsuario = $("#txtUsuario").val();
                            txtDescripcion = $("#txtDescripcion").val();
                            txtInfraccion = $("#slInfraccion").val();
                            txtResolucion = $("#slResolucion").val();

                            txtFechaIni = $("#txtFechaIni").val();
                            txtFechaFin = $("#txtFechaFin").val();

                            strAttach = $("#attach1").val();

                            $.blockUI({ message: "<h1> Procesando expediente...</h1>" });
                            document.frmMain.action = "CargaPDF/CierraExpediente.asp?txtUnidad=" + txtUnidad + "&txtUsuario=" + txtUsuario + "&txtInfraccion=" + txtInfraccion + "&txtResolucion=" + txtResolucion + "&txtFechaIni=" + txtFechaIni + "&txtFechaFin=" + txtFechaFin + "&txtDescripcion=" + txtDescripcion + "&attach1=" + strAttach + "&idFolio=" + idFolio;
                            document.frmMain.submit();
                        } // end if
                    } //function (result)
                }); // end msgbox
            },
            Actualizar() {
                strAttach = $("#attach1").val();
                posicion = strAttach.indexOf(',');
                if (posicion != -1) {
                    expedienteFn.Alerta('El nombre del archivo PDF contiene comas, por favor renombre el archivo y vuelva a anexarlo.');
                    return false;
                }

                if ($("#attach1").val() != "") {
                    var strNombreFile = $("#attach1").val();
                    strNombreFile = strNombreFile.substring(strNombreFile.length - 3)

                    if (strNombreFile.toUpperCase() != "PDF") {

                        $("#message-alerta").html("");
                        $("#message-alerta").prepend('<div id="mensaje_error" class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alerta:</strong> El archivo debe ser PDF.</p></div>');
                        $("#message-alerta").slideDown('slow');
                        setTimeout(function () {
                            $("#mensaje_error").slideUp(750);
                        }, 6000);

                        $("#attach1").focus();
                        return false;
                    }

                    if ($("#txtDescPDF").val().length == 0) {

                        $("#message-alerta").html("");
                        $("#message-alerta").prepend('<div id="mensaje_error" class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alerta:</strong> Debe indicar una descripción para el documento PDF que está anexando.</p></div>');
                        $("#message-alerta").slideDown('slow');
                        setTimeout(function () {
                            $("#mensaje_error").slideUp(750);
                        }, 6000);

                        $("#txtDescPDF").focus();
                        return false;
                    }
                }

                $.msgBox({
                    title: "Expedientes Comisión de Usuarios y Conducta",
                    content: "¿ Desea actualizar el expediente ?",
                    type: "confirm",
                    buttons: [{ value: "Yes" }, { value: "No" }],
                    success: function (result) {
                        if (result == "Yes") {

                            idFolio = $("#idFolio").val();
                            txtUnidad = $("#idUnidad").val();
                            txtUsuario = $("#txtUsuario").val();
                            txtInfraccion = $("#slInfraccion").val();

                            txtResolucion = $("#slResolucion").val();
                            txtFechaIni = $("#txtFechaIni").val();
                            txtFechaFin = $("#txtFechaFin").val();

                            txtResolucion2 = $("#slResolucion2").val();
                            txtFechaIni2 = $("#txtFechaIni2").val();
                            txtFechaFin2 = $("#txtFechaFin2").val();


                            vlObservaciones = "";
                            if ($("#txtNota").length > 0) {
                                vlObservaciones = $("#txtNota").val();
                            }

                            txtDescripcion = $("#txtDescripcion").val();
                            strAttach = $("#attach1").val();
                            strDescPDF = $("#txtDescPDF").val();

                            $.blockUI({ message: "<h1> Procesando expediente...</h1>" });
                            document.frmMain.action = "CargaPDF/CargaDocumento.asp?txtUnidad=" + txtUnidad + "&txtUsuario=" + txtUsuario + "&txtInfraccion=" + txtInfraccion + "&txtResolucion=" + txtResolucion + "&txtFechaIni=" + txtFechaIni + "&txtFechaFin=" + txtFechaFin + "&txtDescripcion=" + txtDescripcion + "&attach1=" + strAttach + "&idFolio=" + idFolio + "&txtNota=" + vlObservaciones + "&strDescPDF=" + strDescPDF + "&txtResolucion2=" + txtResolucion2 + "&txtFechaIni2=" + txtFechaIni2 + "&txtFechaFin2=" + txtFechaFin2;
                            document.frmMain.submit();
                        } // end if
                    } //function (result)
                }); // end msgbox
            },
            Alerta(strMensaje) {
                $("#message-alerta").html("");
                $("#message-alerta").prepend('<div id="mensaje_error" class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alerta:</strong> ' + strMensaje + ' .</p></div>');
                $("#message-alerta").slideDown('slow');
                setTimeout(function () {
                    $("#mensaje_error").slideUp(750);
                }, 6000);
            },
            LlenaResolucion(strResolucion, strResolucion2) {
                $.ajax({
                    type: "POST",
                    url: "Asincrono/SegundaResolucion.asp",
                    data: "Resolucion=" + strResolucion + "&Resolucion2=" + strResolucion2,
                    cache: false,
                    success: function (html) {
                        $("#slResolucion2").html(html)
                        //$("#txtFechaIni2").val( '' );
                        //$("#txtFechaFin2").val( '' );
                    }
                });
            },
            click(e) {
                if (document.all) {
                    if (event.button == 2 || event.button == 3) {
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
            },
            ismaxlength(obj) {
                var mlength = obj.getAttribute ? parseInt(obj.getAttribute("maxlength")) : ""
                var vlTecla = window.event.keyCode
                var vlAncho = document.frmMain.txtNota.value.length
                //alert(vlAncho);
                //alert(vlTecla);
                if (obj.getAttribute && obj.value.length > mlength)
                    obj.value = obj.value.substring(0, mlength)

                if (vlTecla == 219)
                    obj.value = obj.value.substring(0, vlAncho - 1)
            },
            BuscaUsuario() {
                idUnidad = $("#idUnidad").val();
                idUsuario = $("#txtUsuario").val();


                $.ajax({
                    type: "POST",
                    url: "Asincrono/ConsultaPlan.asp",
                    data: "idUnidad=" + idUnidad + "&idUsuario=" + idUsuario,
                    cache: false,
                    success: function (html) {
                        $("#txtPlan").val(html);
                    }
                });


                $.ajax({
                    type: "POST",
                    url: "Asincrono/ConsultaUsuario.asp",
                    data: "idUnidad=" + idUnidad + "&idUsuario=" + idUsuario,
                    cache: false,
                    success: function (html) {
                        $("#txtNombre").val(html);
                    }
                });


            },
            PresentaNota() {

                if (document.frmMain.vlMuestraNota.value == "1") {
                    vlTabla = "<table width='200' border='0'>"
                    vlTabla = vlTabla + "<tr>"
                    vlTabla = vlTabla + "<th scope='col'><textarea name='txtNota' maxlength='300' cols='80' rows='5' id='txtNota'></textarea></th>"
                    vlTabla = vlTabla + "</tr>"
                    vlTabla = vlTabla + "</table>"

                    document.getElementById('DivComentario').innerHTML = vlTabla;
                    document.frmMain.vlMuestraNota.value = 0;
                }

                document.frmMain.txtNota.focus();
                document.frmMain.txtNota.select();
            },
            Grabar() {

                if (document.frmMain.txtNota.value == "") {
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
                document.frmMain.action = "ModificaExpediente.asp?Graba=1&Folio=" + vlFolio + "&txtNota=" + vlObservaciones + "&idUnidad=" + vlUnidad;
                document.frmMain.submit();

            },
            EliminarPdf() {
                var documentoId = this.id;
                var DocumentoId = documentoId.substring(0, documentoId.length - 4);

                $.msgBox({
                    title: "Expedientes Comisión de Usuarios y Conducta",
                    content: "¿ Seguro que desea  eliminar este documento ?",
                    type: "confirm",
                    buttons: [{ value: "Yes" }, { value: "No" }],
                    success: function (result) {
                        if (result == "Yes") {
                            $.ajax({
                                type: 'GET',
                                url: "Asincrono/EliminarDocumento.asp?DocumentoId=" + DocumentoId,
                                dataType: "html",
                                contentType: "application/x-www-form-urlencoded",
                                cache: false,
                                //data:cadena,
                                beforeSend: function () {
                                    //$(".progress-bar").css("display","block");
                                    //mbe.presentation.progressBarSimulate();
                                },
                                success: function (data) {
                                    //alert(data);
                                    imagen = document.getElementById(documentoId + "1");
                                    padre = imagen.parentNode;
                                    padre.removeChild(imagen);

                                    imagen1 = document.getElementById(documentoId + "2");
                                    padre1 = imagen1.parentNode;
                                    padre1.removeChild(imagen1);
                                },
                                async: false,
                            });// end $.ajax

                        } // end if
                    } //function (result)
                }); // end msgbox

            }
        };
    expedienteFn.init();
});
