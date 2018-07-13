$(function () {
    var tblEventos, tblDonantes, lstDonantes = [], tblGastos, lstGastos = [], consecutivo = 0, consecutivo1 = 0;
    var eventosFn = {
        init() {
            //Cargar Catolagos
            this.getEventos();
            fn.GetConcepto()
                .done(function () {
                    eventosFn.changeConcepto();
                });
            fn.GetComprobanteTipo();
            //inicializar eventos
            fn.SetDate("#txtFechaComprobante", "");
            fn.SetDate("#txtFecha1", "");
            $("#btnreturn").click(this.returnRendicion);
            $("#frmEvento").submit(this.saveRendicion);
            $("#tblEventos").on("click", "a", this.clickCursos);
            $("#txtEfectivo").focusout(this.focusout);
            $("#txtCheque1").focusout(this.focusout);
            $("#txtCheque1").on("input", this.inputAnticipo);
            $("#slcConcepto").change(this.changeConcepto);
            //modal donantes
            $("#txtEfectivoD").focusout(this.focusout);
            $("#txtDeposito").focusout(this.focusout);
            $("#txtCheque").focusout(this.focusout);
            $("#txtTarjeta").focusout(this.focusout);
            $("#txtEfectivoD").on("input", this.inputDonativo);
            $("#txtDeposito").on("input", this.inputDonativo);
            $("#txtCheque").on("input", this.inputDonativo);
            $("#txtTarjeta").on("input", this.inputDonativo);

            $("#btnNewD").click(this.clickAgregarD);
            $("#frmDonante").submit(this.addDonante);
            $('#tblDonantes').on('click', 'button', this.deleteDonante);
            $('#tblDonantes').on('click', 'a', this.editDonante);

            //modal gastos
            $("#btnNew").click(this.clickAgregar);
            $("#txtSubtotal").on("input", this.inputGasto);
            $("#txtIva").on("input", this.inputGasto);
            $("#frmGasto").submit(this.addGasto);
            $('#tblGastos').on('click', 'button', this.deleteGasto);
            $('#tblGastos').on('click', 'a', this.editGasto);

            $('#txtBusqueda').keyup(function () {
                tblEventos.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblEventos.page.info();
                tblEventos.page.len($(this).val()).draw();
            });
            $('#slcPeriodos').change(function () {
                tblEventos
                    .column(6)
                    .search(this.value)
                    .draw();
            });

        },
        getEventos() {
            fn.BlockScreen(true);
            fn.Api("Eventos/Get/1", "GET", "")
                .done(function (data) {
                    fn.GetPeriodos(data.periodos);
                    tblEventos = $('#tblEventos').DataTable({
                        data: data.eventos,
                        columns: [
                            { data: 'folio' },
                            { data: 'centroCostos' },
                            { data: 'lugarEvento' },
                            { data: 'nombreEvento' },
                            { data: 'eventoTipo' },
                            { data: 'instructor' },
                            { data: 'fechaEvento' },
                            {
                                data: 'anticipo',
                                render: function (data, f, d) {
                                    return (parseFloat(data)).toLocaleString('es-mx', {
                                        style: 'currency',
                                        currency: 'MXN',
                                        minimumFractionDigits: 2
                                    });
                                },
                                orderable: false
                            },
                            {
                                data: 'totalGastos',
                                render: function (data, f, d) {
                                    return (parseFloat(data)).toLocaleString('es-mx', {
                                        style: 'currency',
                                        currency: 'MXN',
                                        minimumFractionDigits: 2
                                    });
                                },
                                orderable: false
                            },
                            {
                                data: 'observaciones',
                                render: function (data, f, d) {
                                    var color = "";
                                    if (data == "Devolucion") {
                                        color = "alert-warning";
                                    } else if (data == "Reembolso") {
                                        color = "alert-danger";
                                    } else {
                                        return "";
                                    }
                                    var status = '<div class="' + color + '" role="alert">' + data + '</div><br/>';
                                    return status;
                                }
                            },
                            {
                                data: 'saldo',
                                render: function (data, f, d) {
                                    return (parseFloat(data)).toLocaleString('es-mx', {
                                        style: 'currency',
                                        currency: 'MXN',
                                        minimumFractionDigits: 2
                                    });
                                },
                                orderable: false
                            },
                            {
                                data: 'totalRecaudado',
                                render: function (data, f, d) {
                                    return (parseFloat(data)).toLocaleString('es-mx', {
                                        style: 'currency',
                                        currency: 'MXN',
                                        minimumFractionDigits: 2
                                    });
                                },
                                orderable: false
                            },
                            {
                                data: 'estatusId',
                                render: function (data, f, d) {
                                    if (data == 1) {
                                        return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Rendir gastos</a> ';
                                    } else {
                                        return '<a class="btn btn-success btn-sm" href="" onclick="return false;">Ver</a> ';
                                    }
                                },
                                orderable: false,
                                className: 'text-center'
                            }
                        ],
                        processing: true,
                        paging: true,
                        searching: true,
                        ordering: true,
                        info: false,
                        stateSave: false,
                        destroy: true,
                        responsive: true,
                        language: {
                            paginate: {
                                previous: '< Anterior',
                                next: 'Siguiente >'
                            },
                            processing: "Procesando..."
                        }
                    });
                    $('#slcPeriodos').change();
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Cursos", data);
                });

        },
        returnRendicion() {
            $("#divGenerales").hide();
            $("#divTabla").show();
        },
        clickCursos() {
            var row = this.parentNode.parentNode;
            var evento = tblEventos.row(row).data();
            if (this.innerHTML == "Rendir gastos") {
                fn.BlockScreen(true);
                eventosFn.editarEvento(evento);
            } else {
                eventosFn.generatePdf(evento.eventoId);
                fn.BlockScreen(true);
            }
        },
        editarEvento(evento) {
            $('#btnSave').removeData('eventoId');
            $("#btnSave").data("eventoId", evento.eventoId);
            $("#slcCentroCostos").val(evento.centroCostos);
            $("#txtLugar").val(evento.lugarEvento);
            $("#txtNombreEvento").val(evento.nombreEvento);
            $("#slcEventoTipo").val(evento.eventoTipo);
            $("#txtFecha").val(evento.fechaEvento);
            $("#slcInstructor").val(evento.instructor);
            $("#txtEfectivo").val(evento.efectivo);
            $("#txtCheque1").val(evento.chequeTans);
            $("#txtFecha1").val(evento.fechachequeTans);
            $("#txtNoCheque1").val(evento.numeroChequeTans);
            if (evento.chequeTans == 0) {
                $("#txtFecha1").prop("disabled", true);
                $("#txtNoCheque1").prop("disabled", true);
            } else {
                $("#txtFecha1").prop("disabled", false);
                $("#txtNoCheque1").prop("disabled", false);
            }

            $("#divGenerales").show();
            $("#divTabla").hide();
            lstDonantes = evento.donantes.slice();
            consecutivo = lstDonantes.length;
            eventosFn.loadTableDonantes(lstDonantes);
            lstGastos = evento.gastos.slice();
            consecutivo1 = lstGastos.length;
            eventosFn.loadTableGastos(lstGastos);
            fn.BlockScreen(false);
        },
        focusout() {
            if (this.value == "") { this.value = 0; }
        },
        clickAgregarD() {
            $("#frmDonante")[0].reset();
            $("#validFormas").hide();
            $('#btnAddD').removeData('donanteId');
            $("#modalDonantes").modal("show");
        },
        inputDonativo() {
            var total = (parseFloat($("#txtEfectivoD").val()) || 0) + (parseFloat($("#txtDeposito").val()) || 0) + (parseFloat($("#txtCheque").val()) || 0) + (parseFloat($("#txtTarjeta").val()) || 0);
            total = (total).toLocaleString('es-mx', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2
            });
            $("#txtTotalD").val(total);
        },
        addDonante(e) {
            e.preventDefault();
            if (eventosFn.validFormasPago()) {
                var cons = $("#btnAddD").data("donanteId");
                if (cons === undefined) {
                    consecutivo += 1;
                    lstDonantes.push(
                        {
                            donanteId: consecutivo,
                            nombre: $("#txtNombre").val(),
                            apellido: $("#txtApellido").val(),
                            efectivo: $("#txtEfectivoD").val(),
                            deposito: $("#txtDeposito").val(),
                            cheque: $("#txtCheque").val(),
                            tarjeta: $("#txtTarjeta").val(),
                            email: $("#txtEmail").val(),
                            celular: $("#txtCelular").val()
                        });
                } else {
                    var donante = lstDonantes.filter(function (e) { return e.donanteId === cons; });
                    donante[0].nombre = $("#txtNombre").val();
                    donante[0].apellido = $("#txtApellido").val();
                    donante[0].efectivo = $("#txtEfectivoD").val();
                    donante[0].deposito = $("#txtDeposito").val();
                    donante[0].cheque = $("#txtCheque").val();
                    donante[0].tarjeta = $("#txtTarjeta").val();
                    donante[0].email = $("#txtEmail").val();
                    donante[0].celular = $("#txtCelular").val();
                }
                eventosFn.loadTableDonantes(lstDonantes);
                $("#modalDonantes").modal("hide");
            }
        },
        loadTableDonantes(lst) {
            document.getElementById("tblDonantes").deleteTFoot();
            tblDonantes = $('#tblDonantes').DataTable({
                data: lst,
                columns: [
                    {
                        data: null,
                        render: function (data, f, d) {
                            return data.nombre + " " + data.apellido;
                        }
                    },
                    {
                        data: null,
                        render: function (data, f, d) {
                            return (parseFloat(data.efectivo) + parseFloat(data.deposito) + parseFloat(data.cheque) + parseFloat(data.tarjeta)).toLocaleString('es-mx', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2
                            });
                        },
                        orderable: false
                    },
                    { data: 'email' },
                    { data: 'celular' },
                    {
                        data: null,
                        render: function (data, f, d) {
                            return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Edición</a> ';
                        },
                        orderable: false,
                        className: 'text-center'
                    },
                    {
                        data: null,
                        render: function (data, f, d) {
                            return '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        },
                        orderable: false,
                        className: 'text-center'
                    }

                ],
                processing: true,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                stateSave: true,
                destroy: true,
                responsive: true
            });

            var Total = 0;
            $(lst).each(function () {
                Total += parseFloat(this.efectivo) + parseFloat(this.deposito) + parseFloat(this.cheque) + parseFloat(this.tarjeta);
            });
            var tfoot = "<tfoot><tr> <td colspan='2' class='text-right font-weight-bold'>Total: " + (Total).toLocaleString('es-mx', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2
            }) + "</td></tr></tfoot > ";
            $("#tblDonantes").append(tfoot);
        },
        editDonante() {
            var row = this.parentNode.parentNode;
            var donante = tblDonantes.row(row).data();
            $("#txtNombre").val(donante.nombre);
            $("#txtApellido").val(donante.apellido);
            $("#txtEfectivo").val(donante.efectivo);
            $("#txtDeposito").val(donante.deposito);
            $("#txtCheque").val(donante.cheque);
            $("#txtTarjeta").val(donante.tarjeta);
            $("#txtEmail").val(donante.email);
            $("#txtCelular").val(donante.celular);
            $('#btnAddD').removeData('donanteId');
            $("#btnAddD").data("donanteId", donante.donanteId);
            $("#modalDonantes").modal("show");
        },
        deleteDonante() {
            var row = this.parentNode.parentNode;
            var donante = tblDonantes.row(row).data();
            lstDonantes = lstDonantes.filter(function (e) { return e.donanteId !== donante.donanteId; });
            eventosFn.loadTableDonantes(lstDonantes);
        },
        inputAnticipo() {
            if (this.value > 0) {
                if (this.id == "txtCheque1") {
                    $("#txtFecha1").prop("disabled", false);
                    $("#txtNoCheque1").prop("disabled", false);
                }
            } else {
                if (this.id == "txtCheque1") {
                    $("#txtFecha1").prop("disabled", true);
                    $("#txtNoCheque1").prop("disabled", true);
                }
            }
        },
        changeConcepto() {
            fn.GetSubConcepto($("#slcConcepto").val());
        },
        clickAgregar() {
            $("#frmGasto")[0].reset();
            $('#btnAdd').removeData('consecutivoId');
            $("#modalGastos").modal("show");
        },
        inputGasto() {
            var subtotal = (parseFloat($("#txtSubtotal").val()) || 0);
            var iva = (parseFloat($("#txtIva").val()) || 0);
            var total = (subtotal + iva).toLocaleString('es-mx', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2
            });
            $("#txtTotal").val(total);
        },
        addGasto(e) {
            e.preventDefault();
            var cons = $("#btnAdd").data("consecutivoId");
            if (cons === undefined) {
                consecutivo1 += 1;
                lstGastos.push(
                    {
                        consecutivoId: consecutivo1,
                        instructorId: $("#slcInstructor").val(),
                        instructor: $("#slcInstructor  :selected").text(),
                        comprobanteTipoId: $("#slcComprobanteTipo").val(),
                        comprobanteTipo: $("#slcComprobanteTipo :selected").text(),
                        fecha: $("#txtFechaComprobante").val(),
                        conceptoId: $("#slcConcepto").val(),
                        concepto: $("#slcConcepto :selected").text(),
                        subConceptoId: $("#slcSubConcepto").val(),
                        subConcepto: $("#slcSubConcepto :selected").text(),
                        descripcion: $("#txtDescripcion").val(),
                        proveedor: $("#txtProveedor").val(),
                        subTotal: $("#txtSubtotal").val(),
                        iva: $('#txtIva').val(),
                        total: $("#txtTotal").val()
                    });
            } else {
                var gasto = lstGastos.filter(function (e) { return e.consecutivoId === cons; });
                gasto[0].instructorId = $("#slcInstructor").val();
                gasto[0].instructor = $("#slcInstructor  :selected").text();
                gasto[0].comprobanteTipoId = $("#slcComprobanteTipo").val();
                gasto[0].comprobanteTipo = $("#slcComprobanteTipo :selected").text();
                gasto[0].fecha = $("#txtFechaComprobante").val();
                gasto[0].conceptoId = $("#slcConcepto").val();
                gasto[0].concepto = $("#slcConcepto :selected").text();
                gasto[0].subConceptoId = $("#slcSubConcepto").val();
                gasto[0].subConcepto = $("#slcSubConcepto :selected").text();
                gasto[0].descripcion = $("#txtDescripcion").val();
                gasto[0].proveedor = $("#txtProveedor").val();
                gasto[0].subTotal = $("#txtSubtotal").val();
                gasto[0].iva = $('#txtIva').val();
                gasto[0].total = $("#txtTotal").val();
            }

            eventosFn.loadTableGastos(lstGastos);
            $("#modalGastos").modal("hide");
        },
        loadTableGastos(lst) {
            document.getElementById("tblGastos").deleteTFoot();
            tblGastos = $('#tblGastos').DataTable({
                data: lst,
                columns: [
                    { data: 'comprobanteTipo' },
                    { data: 'fecha' },
                    { data: 'concepto' },
                    { data: 'subConcepto' },
                    { data: 'descripcion' },
                    { data: 'proveedor' },
                    {
                        data: 'subTotal',
                        render: function (data, f, d) {
                            return (parseFloat(data)).toLocaleString('es-mx', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2
                            });
                        },
                        orderable: false
                    },
                    {
                        data: 'iva',
                        render: function (data, f, d) {
                            return (parseFloat(data)).toLocaleString('es-mx', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2
                            });
                        },
                        orderable: false
                    },
                    {
                        data: 'total',
                        render: function (data, f, d) {
                            return (parseFloat(data)).toLocaleString('es-mx', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2
                            });
                        },
                        orderable: false
                    },
                    {
                        data: null,
                        render: function (data, f, d) {
                            return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Edición</a> ';
                        },
                        orderable: false,
                        className: 'text-center'
                    },
                    {
                        data: null,
                        render: function (data, f, d) {
                            return '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        },
                        orderable: false,
                        className: 'text-center'
                    }
                ],
                processing: true,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                stateSave: true,
                destroy: true,
                responsive: true
            });

            var Total = 0;
            $(lst).each(function () {
                Total += parseFloat(this.total);
            });
            var tfoot = "<tfoot><tr> <td colspan='9' class='text-right font-weight-bold'>Total: " + (Total).toLocaleString('es-mx', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2
            }) + "</td></tr></tfoot > ";
            $("#tblGastos").append(tfoot);
        },
        editGasto() {
            var row = this.parentNode.parentNode;
            var gasto = tblGastos.row(row).data();
            $("#slcInstructor").val(gasto.instructorId);
            $("#slcComprobanteTipo").val(gasto.comprobanteTipoId);
            fn.SetDate("#txtFechaComprobante", gasto.fecha);
            $("#slcConcepto").val(gasto.conceptoId);
            fn.GetSubConcepto($("#slcConcepto").val())
                .done(function () {
                    $("#slcSubConcepto").val(gasto.subConceptoId);
                });
            $("#txtDescripcion").val(gasto.descripcion);
            $("#txtProveedor").val(gasto.proveedor);
            $("#txtSubtotal").val(gasto.subTotal);
            $("#txtIva").val(gasto.iva);
            $("#txtTotal").val(gasto.total);
            $('#btnAdd').removeData('consecutivoId');
            $("#btnAdd").data("consecutivoId", gasto.consecutivoId);
            $("#modalGastos").modal("show");
        },
        deleteGasto() {
            var row = this.parentNode.parentNode;
            var gasto = tblGastos.row(row).data();
            lstGastos = lstGastos.filter(function (e) { return e.consecutivoId !== gasto.consecutivoId; });
            eventosFn.loadTableGastos(lstGastos);
        },
        validGastos() {
            if (lstGastos.length > 0) {
                $("#validGastos").hide();
                return true;
            }
            else {
                $("#validGastos").show();
                return false;
            }
        },
        validFormasPago() {
            var sumFormas = parseFloat($("#txtEfectivoD").val()) + parseFloat($("#txtDeposito").val()) + parseFloat($("#txtCheque").val()) + parseFloat($("#txtTarjeta").val())
            if (sumFormas > 0) {
                $("#validFormas").hide();
                return true;
            }
            else {
                $("#validFormas").show();
                return false;
            }
        },
        saveRendicion(e) {
            e.preventDefault();
            var $frm = $('#frmEvento');
            if ($frm[0].checkValidity() && eventosFn.validGastos()) {
                fn.BlockScreen(true);
                var eventoId = $("#btnSave").data("eventoId");

                var evento =
                    {
                        eventoId,
                        efectivo: $("#txtEfectivo").val(),
                        chequeTans: $("#txtCheque1").val(),
                        fechachequeTans: $("#txtFecha1").val(),
                        numeroChequeTans: $("#txtNoCheque1").val(),
                        donantes: lstDonantes,
                        gastos: lstGastos
                    };


                fn.Api("Eventos/SaveRendicion", "Post", JSON.stringify(evento))
                    .done(function (data) {
                        $('#btnSave').removeData('eventoId');
                        $("#frmEvento")[0].reset();
                        $("#divGenerales").hide();
                        $("#divTabla").show();
                        eventosFn.getEventos();
                        alertify.alert("Eventos", data.message);
                    })
                    .fail(function (data) {
                        fn.BlockScreen(false);
                        console.log(data);
                        alertify.alert("Eventos", data);
                    });
            }
        },
        generatePdf(eventoId) {
            fn.Api("Eventos/ReporteEvento/" + eventoId, "GET", "")
                .done(function (data) {
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64," + data + "'></iframe>");
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Eventos", data);
                });
        }
    };


    eventosFn.init();
});
