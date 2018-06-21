$(function () {
    var tblEventos;
    var eventosFn = {
        init() {
            //Cargar Catolagos
            this.getEventos();
            fn.GetCentroCostos(2);
            fn.GetSede();
            fn.GetEventoTipo();
            fn.GetInstructor("slcInstructor");

            //inicializar eventos

            $("#btnNuevo").click(this.newEvento);
            $("#btnreturn").click(this.returnRendicion);
            fn.SetDate("#txtFecha", "");
            $("#frmEvento").submit(this.saveRendicion);
            $("#tblEventos").on("click", "a", this.clickEventos);

            $('#txtBusqueda').keyup(function () {
                tblEventos.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblEventos.page.info();
                tblEventos.page.len($(this).val()).draw();
            });

        },
        getEventos() {
            fn.BlockScreen(true);
            fn.Api("Eventos/Get", "GET", "")
                .done(function (data) {
                    tblEventos = $('#tblEventos').DataTable({
                        data: data,
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
                                data: null,
                                render: function (data, f, d) {
                                    if (data.estatusId == 1) {
                                        return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Detalle</a> ';
                                    } else {
                                        return '<a class="btn btn-warning btn-sm" href="" onclick="return false;">Ver</a> ';
                                    }
                                },
                                orderable: false,
                                className: 'text-center'
                            },
                            {
                                data: null,
                                render: function (data, f, d) {
                                    if (data.estatusId == 1) {
                                        return '<a class="btn btn-success btn-sm" href="" onclick="return false;">Aprobar</a> ';
                                    } else {
                                        return '';
                                    }
                                },
                                orderable: false,
                                className: 'text-center'
                            },
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
                        },
                    });
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Cursos", data);
                });


        },
        newEvento() {
            consecutivo = 0;
            $('#btnSave').removeData('eventoId');
            $("#frmEvento")[0].reset();
            $("#divGenerales").show();
            $("#divTabla").hide();
        },
        returnRendicion() {
            $("#divGenerales").hide();
            $("#divTabla").show();
        },
        saveRendicion(e) {
            e.preventDefault();
            var $frm = $('#frmEvento');
            if ($frm[0].checkValidity()) {
                fn.BlockScreen(true);
                var eventoId = $("#btnSave").data("eventoId");

                if (eventoId === undefined) {
                    var evento =
                        {
                            centroCostosId: $("#slcCentroCostos").val(),
                            lugarEvento: $("#txtLugar").val(),
                            nombreEvento: $("#txtNombreEvento").val(),
                            eventoTipoId: $("#slcEventoTipo").val(),
                            instructorId: $("#slcInstructor").val(),
                            fechaEvento: $("#txtFecha").val()
                        };
                } else {
                    var evento =
                        {
                            eventoId,
                            centroCostosId: $("#slcCentroCostos").val(),
                            lugarEvento: $("#txtLugar").val(),
                            nombreEvento: $("#txtNombreEvento").val(),
                            eventoTipoId: $("#slcEventoTipo").val(),
                            instructorId: $("#slcInstructor").val(),
                            fechaEvento: $("#txtFecha").val()
                        };
                }

                fn.Api("Eventos/SaveEvento", "Post", JSON.stringify(evento))
                    .done(function (data) {
                        $('#btnSave').removeData('eventoId');
                        $("#frmEvento")[0].reset();
                        $("#divGenerales").hide();
                        $("#divTabla").show();
                        eventosFn.getEventos();
                        alertify.alert("Evento", data.message);
                    })
                    .fail(function (data) {
                        fn.BlockScreen(false);
                        console.log(data);
                        alertify.alert("Evento", data);
                    });
            }
        },
        clickEventos() {
            var row = this.parentNode.parentNode;
            var evento = tblEventos.row(row).data();
            if (this.innerHTML == "Detalle") {
                fn.BlockScreen(true);
                eventosFn.editarEvento(evento);
            } else if (this.innerHTML == "Ver") {
                fn.BlockScreen(true);
                eventosFn.generatePdf(evento.eventoId);
            } else if (this.innerHTML == "Aprobar")
            {
                eventosFn.aprobar(evento.eventoId);
            }
        },
        editarEvento(evento) {
            $('#btnSave').removeData('eventoId');
            $("#btnSave").data("eventoId", evento.eventoId);
            $("#slcCentroCostos").val(evento.centroCostosId);
            $("#txtLugar").val(evento.lugarEvento);
            $("#txtNombreEvento").val(evento.nombreEvento);
            $("#slcEventoTipo").val(evento.eventoTipoId);
            fn.SetDate("#txtFecha", evento.fechaEvento);
            $("#slcInstructor").val(evento.instructorId);
            $("#txtEfectivo").val(evento.efectivo);
            $("#txtCheque1").val(evento.chequeTans);
            $("#txtFecha1").val(evento.fechachequeTans);
            $("#txtNoCheque1").val(evento.numeroChequeTans);

            $("#divGenerales").show();
            $("#divTabla").hide();
            eventosFn.loadTableDonante(evento.donantes);
            eventosFn.loadTableGastos(evento.gastos);
            fn.BlockScreen(false);
        },
        loadTableDonante(lst) {
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
                    { data: 'celular' }
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
            var tfoot = "<tfoot><tr> <td colspan='10' class='text-right font-weight-bold'>Total: " + (Total).toLocaleString('es-mx', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2
            }) + "</td></tr></tfoot > ";
            $("#tblGastos").append(tfoot);
        },
        aprobar(eventoId)
        {
            alertify.confirm('Aprobar rendición', '¿Estas seguro que deseas aprobar esta rendición?',
                function () {
                    fn.BlockScreen(true);
                    fn.Api("Eventos/Aprobar/" + eventoId, "GET", "")
                        .done(function (data) {
                            alertify.alert("Eventos", data);
                            eventosFn.getEventos();
                        })
                        .fail(function (data) {
                            fn.BlockScreen(false);
                            console.log(data);
                            alertify.alert("Eventos", data);
                        });
                }, function () {
                });
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
