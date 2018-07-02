$(function () {
    var tblReporteGastos, tblGastos, lstGastos = [], consecutivo = 0;
    var gastosFn = {
        init() {
            //Cargar Catolagos
            this.getAllGastos();
            fn.GetCentroCostos(1);
            fn.GetConcepto()
                .done(function () {
                    gastosFn.changeConcepto();
                });
            fn.GetComprobanteTipo();
            //inicializar eventos

            $("#btnNew").click(this.clickAgregar);
            fn.SetDate("#txtFechaInicio", "");
            fn.SetDate("#txtFechaFin", "");
            fn.SetDate("#txtFecha1", "");
            fn.SetDate("#txtFechaComprobante", "");
            $("#slcConcepto").change(this.changeConcepto);
            $("#txtEfectivo").focusout(this.focusout);
            $("#txtCheque1").focusout(this.focusout);
            $("#txtSubtotal").focusout(this.focusout);
            $("#txtIva").focusout(this.focusout);
            $("#txtCheque1").on("input", this.inputAnticipo);
            $("#txtSubtotal").on("input", this.inputGasto);
            $("#txtIva").on("input", this.inputGasto);
            $("#frmGasto").submit(this.addGasto);
            $('#tblGastos').on('click', 'button', this.deleteGasto);
            $('#tblGastos').on('click', 'a', this.editGasto);
            $("#frmGenerales").submit(this.saveRendicion);
            $('#txtBusqueda').keyup(function () {
                tblReporteGastos.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblReporteGastos.page.info();
                tblReporteGastos.page.len($(this).val()).draw();
            });
            $("#tblReporteGastos").on("click", "a", this.clickReporteGastos);
            $("#btnNueva").click(this.newRendicion);
            $("#btnreturn").click(this.returnRendicion);
        },
        getAllGastos() {
            fn.BlockScreen(true);
            fn.Api("Gastos/Get/1", "GET", "")
                .done(function (data) {
                    tblReporteGastos = $('#tblReporteGastos').DataTable({
                        data: data,
                        columns: [
                            { data: 'centroCostos' },
                            { data: 'periodo' },
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
                                data: 'gastos',
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
                            { data: 'fecha' },
                            {
                                data: "estatusId",
                                render: function (data, f, d) {
                                    if (data == 1) {
                                        return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Editar</a> ';
                                    } else
                                    {
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
                        stateSave: true,
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
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Gastos", data);
                });


        },
        newRendicion()
        {
            gastosFn.resetForm();
            $("#divGenerales").show();
            $("#divTabla").hide();
        },
        returnRendicion()
        {
            $("#divGenerales").hide();
            $("#divTabla").show();
        },
        clickReporteGastos() {
            var row = this.parentNode.parentNode;
            var gasto = tblReporteGastos.row(row).data();
            if (this.innerHTML == "Ver") {
                fn.BlockScreen(true);
                gastosFn.generatePdf(gasto.gastoId);
            } else {
                fn.BlockScreen(true);
                gastosFn.editarReporteGastos(gasto.gastoId);
            }
        },
        editarReporteGastos(gastoId) {
            fn.Api("Gastos/GetDetails/" + gastoId, "GET", "")
                .done(function (data) {
                    $('#btnSave').removeData('gastoId');
                    $("#btnSave").data("gastoId", data.gastoId);
                    $("#slcCentroCostos").val(data.centroCostosId);
                    $("#slcInstructor").val(data.usuarioId);
                    fn.SetDate("#txtFechaInicio", data.fechaInicio);
                    fn.SetDate("#txtFechaFin", data.fechaFin);
                    $("#txtEfectivo").val(data.efectivo);
                    $("#txtCheque1").val(data.chequeTransNuevo);
                    fn.SetDate("#txtFecha1", data.fechaNuevo);
                    $("#txtNoCheque1").val(data.numeroNuevo);
                    if (data.chequeTransNuevo == 0) {
                        $("#txtFecha1").prop("disabled", true);
                        $("#txtNoCheque1").prop("disabled", true);
                    } else {
                        $("#txtFecha1").prop("disabled", false);
                        $("#txtNoCheque1").prop("disabled", false);
                    }
                    $("#divGenerales").show();
                    $("#divTabla").hide();
                    lstGastos = data.gastoDetalle;
                    consecutivo = lstGastos.length;
                    gastosFn.loadTableGastos(lstGastos);
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Gastos", data);
                });
        },
        clickAgregar() {
            $('#slcComprobanteTipo').val($('#slcComprobanteTipo option:first').val());
            $("#txtFechaComprobante").val("");
            $('#slcConcepto').val($('#slcConcepto option:first').val());
            fn.GetSubConcepto($("#slcConcepto").val());
            $("#txtDescripcion").val("");
            $("#txtProveedor").val("");
            $("#txtSubtotal").val(0);
            $("#txtIva").val(0);
            $("#txtTotal").val(0);
            $('#btnAdd').removeData('consecutivoId');
            $("#modalGastos").modal("show");
        },
        changeConcepto() {
            fn.GetSubConcepto($("#slcConcepto").val());
        },
        focusout() {
            if (this.value == "") { this.value = 0; }
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
        inputGasto() {
            var subtotal = (parseFloat($("#txtSubtotal").val()) || 0);
            var iva = (parseFloat($("#txtIva").val()) || 0);
            $("#txtTotal").val(subtotal + iva);
        },
        addGasto(e) {
            e.preventDefault();
            var cons = $("#btnAdd").data("consecutivoId");
            if (cons === undefined) {
                consecutivo += 1;
                lstGastos.push(
                    {
                        consecutivoId: consecutivo,
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

            gastosFn.loadTableGastos(lstGastos);
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
            gastosFn.loadTableGastos(lstGastos);
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
        saveRendicion(e) {
            e.preventDefault();
            var $frm = $('#frmGenerales');
            if ($frm[0].checkValidity() && gastosFn.validGastos()) {
                fn.BlockScreen(true);
                var gastoId = $("#btnSave").data("gastoId");

                if (gastoId === undefined) {
                    var gastos =
                        {
                            centroCostosId: $("#slcCentroCostos").val(),
                            fechaInicio: $("#txtFechaInicio").val(),
                            fechaFin: $("#txtFechaFin").val(),
                            efectivo: $("#txtEfectivo").val(),
                            chequeTransNuevo: $("#txtCheque1").val(),
                            fechaNuevo: $("#txtFecha1").val(),
                            numeroNuevo: $("#txtNoCheque1").val(),
                            gastoDetalle: lstGastos
                        };
                } else
                {
                    var gastos =
                        {
                            gastoId,
                            centroCostosId: $("#slcCentroCostos").val(),
                            fechaInicio: $("#txtFechaInicio").val(),
                            fechaFin: $("#txtFechaFin").val(),
                            efectivo: $("#txtEfectivo").val(),
                            chequeTransNuevo: $("#txtCheque1").val(),
                            fechaNuevo: $("#txtFecha1").val(),
                            numeroNuevo: $("#txtNoCheque1").val(),
                            gastoDetalle: lstGastos
                        };
                }
               
                fn.Api("Gastos/Save", "Post", JSON.stringify(gastos))
                    .done(function (data) {
                        gastosFn.resetForm();
                        $("#divGenerales").hide();
                        $("#divTabla").show();
                        gastosFn.getAllGastos();
                        alertify.alert("Gastos", data.message);
                    })
                    .fail(function (data) {
                        fn.BlockScreen(false);
                        console.log(data);
                        alertify.alert("Gastos", data);
                    });
            }
        },
        generatePdf(gastoId) {
            fn.Api("Gastos/ReporteGastos/" + gastoId, "GET", "")
                .done(function (data) {
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64," + data + "'></iframe>");
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Gastos", data);
                });
        },
        resetForm()
        {
            $('#btnSave').removeData('gastoId');
            $("#frmGenerales")[0].reset();
            $("#txtFecha1").prop("disabled", true);
            $("#txtNoCheque1").prop("disabled", true);
            $('#tblGastos').DataTable().clear().draw();
            lstGastos = [];
            consecutivo = 0;
        }

    };


    gastosFn.init();
});
