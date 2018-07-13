$(function () {
    var tblReporteGastos, tblGastos, lstGastos = [], consecutivo = 0;
    var gastosFn = {
        init() {
            //Cargar Catolagos
            this.getAllGastos();

            //inicializar eventos

            $('#txtBusqueda').keyup(function () {
                tblReporteGastos.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblReporteGastos.page.info();
                tblReporteGastos.page.len($(this).val()).draw();
            });

            $('#slcPeriodos').change(function () {
                tblReporteGastos
                    .column(2)
                    .search(this.value)
                    .draw();
            });

            $("#tblReporteGastos").on("click", "a", this.clickReporteGastos);
            $("#btnreturn").click(this.returnRendicion);
        },
        getAllGastos() {
            fn.BlockScreen(true);
            fn.Api("Gastos/Get/2", "GET", "")
                .done(function (data) {
                    fn.GetPeriodos(data.periodos);
                    tblReporteGastos = $('#tblReporteGastos').DataTable({
                        data: data.gastos,
                        columns: [
                            { data: 'centroCostos' },
                            { data: 'resposable' },
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
                                data: null,
                                render: function (data, f, d) {
                                    return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Detalle</a> ';
                                },
                                orderable: false,
                                className: 'text-center'
                            },
                            {
                                data: "estatusId",
                                render: function (data, f, d) {
                                    if (data == 1) {
                                        return '<a class="btn btn-success btn-sm" href="" onclick="return false;">Aprobar</a> ';
                                    } else {
                                        return '<a class="btn btn-warning btn-sm" href="" onclick="return false;">Ver</a> ';
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
                    alertify.alert("Gastos", data);
                });


        },
        returnRendicion() {
            $("#divGenerales").hide();
            $("#divTabla").show();
        },
        clickReporteGastos() {
            var row = this.parentNode.parentNode;
            var gasto = tblReporteGastos.row(row).data();
            if (this.innerHTML == "Ver") {
                fn.BlockScreen(true);
                gastosFn.generatePdf(gasto.gastoId);
            } else if (this.innerHTML == "Detalle") {
                fn.BlockScreen(true);
                gastosFn.editarReporteGastos(gasto.gastoId);
            } else if (this.innerHTML == "Aprobar") {
                fn.BlockScreen(true);
                gastosFn.aprobar(gasto.gastoId);
            }
        },
        editarReporteGastos(gastoId) {
            fn.Api("Gastos/GetDetails/" + gastoId, "GET", "")
                .done(function (data) {
                    $('#btnSave').removeData('gastoId');
                    $("#btnSave").data("gastoId", data.gastoId);
                    $("#slcCentroCostos").val(data.centroCostos);
                    $("#slcInstructor").val(data.usuario);
                    $("#txtFechaInicio").val(data.fechaInicio);
                    $("#txtFechaFin").val(data.fechaFin);
                    $("#txtEfectivo").val(data.efectivo);
                    $("#txtCheque1").val(data.chequeTransNuevo);
                    $("#txtFecha1").val(data.fechaNuevo);
                    $("#txtNoCheque1").val(data.numeroNuevo);
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
        aprobar(gastoId) {
            alertify.confirm('Aprobar rendición', '¿Estas seguro que deseas aprobar esta rendición?',
                function () {
                    fn.BlockScreen(true);
                    fn.Api("Gastos/Aprobar/" + gastoId, "GET", "")
                        .done(function (data) {
                            alertify.alert("Gastos", data);
                            gastosFn.getAllGastos();
                        })
                        .fail(function (data) {
                            fn.BlockScreen(false);
                            console.log(data);
                            alertify.alert("Gastos", data);
                        });
                }, function () {
                    fn.BlockScreen(false);
                });
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
        resetForm() {
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
