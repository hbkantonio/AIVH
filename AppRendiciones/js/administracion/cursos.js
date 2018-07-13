$(function () {
    var tblCursos, tblParticipantes, tblGastos, lstParticipantes = [], consecutivo = 0;
    var cursosFn = {
        init() {
            //Cargar Catolagos
            this.getCursos();
            fn.GetCentroCostos(1);
            fn.GetSede();
            fn.GetCursoTipo();
            fn.GetInstructor("slcInstructor1");
            var option1 = $(document.createElement('option'));
            option1.text("--Sin instructor--");
            option1.val(0);
            $("#slcInstructor2").append(option1);
            fn.GetInstructor("slcInstructor2");

            //inicializar eventos

            $("#btnNuevo").click(this.newCurso);
            $("#btnreturn").click(this.returnRendicion);
            fn.SetDate("#txtFecha", "");
            $("#frmCurso").submit(this.saveRendicion);
            $("#btnNew").click(this.clickAgregar);
            $("#tblCursos").on("click", "a", this.clickCursos);
            $("#txtEfectivo").focusout(this.focusout);
            $("#txtDeposito").focusout(this.focusout);
            $("#txtCheque").focusout(this.focusout);
            $("#txtTarjeta").focusout(this.focusout);
            $("#txtEfectivo").on("input", this.inputParticipante);
            $("#txtDeposito").on("input", this.inputParticipante);
            $("#txtCheque").on("input", this.inputParticipante);
            $("#txtTarjeta").on("input", this.inputParticipante);
            $("#frmParticipante").submit(this.addParticipante);
            $('#tblParticipantes').on('click', 'button', this.deleteParticipante);
            $('#tblParticipantes').on('click', 'a', this.editParticipante);

            $('#txtBusqueda').keyup(function () {
                tblCursos.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblCursos.page.info();
                tblCursos.page.len($(this).val()).draw();
            });

            $('#slcPeriodos').change(function () {
                tblCursos
                    .column(6)
                    .search(this.value)
                    .draw();
            });
        },
        getCursos() {
            fn.BlockScreen(true);
            fn.Api("Cursos/Get/2", "GET", "")
                .done(function (data) {
                    fn.GetPeriodos(data.periodos);
                    tblCursos = $('#tblCursos').DataTable({
                        data: data.cursos,
                        columns: [
                            { data: 'folio' },
                            { data: 'centroCostos' },
                            { data: 'sede' },
                            { data: 'lugarCurso' },
                            { data: 'cursoTipo' },
                            {
                                data: null,
                                render: function (data, f, d) {
                                    return data.instructor2 != null ? data.instructor1 + " / " + data.instructor2 : data.instructor1
                                }
                            },
                            { data: 'fechaCurso' },
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
                        stateSave: false,
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
                    $('#slcPeriodos').change();
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Cursos", data);
                });


        },
        newCurso() {
            consecutivo = 0;
            $('#btnSave').removeData('cursoId');
            $("#frmCurso")[0].reset();
            lstParticipantes = [];
            if (tblParticipantes != undefined) {
                tblParticipantes
                    .clear()
                    .draw();
                document.getElementById("tblParticipantes").deleteTFoot();
            }
            $("#divGenerales").show();
            $("#divTabla").hide();
            $("#divAnticipos").hide();
            $("#divGastos").hide();
        },
        returnRendicion() {
            $("#divGenerales").hide();
            $("#divTabla").show();
        },
        saveRendicion(e) {
            e.preventDefault();
            var $frm = $('#frmCurso');
            if ($frm[0].checkValidity() && cursosFn.validInstuctores()) {
                fn.BlockScreen(true);
                var cursoId = $("#btnSave").data("cursoId");

                if (cursoId === undefined) {
                    var curso =
                        {
                            centroCostosId: $("#slcCentroCostos").val(),
                            sedeId: $("#slcSede").val(),
                            lugarCurso: $("#txtLugar").val(),
                            cursoTipoId: $("#slcCursoTipo").val(),
                            instructorId1: $("#slcInstructor1").val(),
                            comision1: $("#slcComision1").val(),
                            instructorId2: $("#slcInstructor2").val(),
                            comision2: $("#slcComision2").val(),
                            fechaCurso: $("#txtFecha").val(),
                            participantes: lstParticipantes
                        };
                } else {
                    var curso =
                        {
                            cursoId,
                            centroCostosId: $("#slcCentroCostos").val(),
                            sedeId: $("#slcSede").val(),
                            lugarCurso: $("#txtLugar").val(),
                            cursoTipoId: $("#slcCursoTipo").val(),
                            instructorId1: $("#slcInstructor1").val(),
                            comision1: $("#slcComision1").val(),
                            instructorId2: $("#slcInstructor2").val(),
                            comision2: $("#slcComision2").val(),
                            fechaCurso: $("#txtFecha").val(),
                            participantes: lstParticipantes
                        };
                }

                fn.Api("Cursos/SaveCurso", "Post", JSON.stringify(curso))
                    .done(function (data) {
                        $('#btnSave').removeData('cursoId');
                        $("#frmCurso")[0].reset();
                        $("#divGenerales").hide();
                        $("#divTabla").show();
                        cursosFn.getCursos();
                        alertify.alert("Cursos", data.message);
                    })
                    .fail(function (data) {
                        fn.BlockScreen(false);
                        console.log(data);
                        alertify.alert("Cursos", data);
                    });
            }
        },
        validInstuctores() {
            if ($("#slcInstructor1").val() != $("#slcInstructor2").val()) {
                return true;
            }
            else {
                alertify.alert("Cursos", "No puedes seleccionar dos veces el mismo instructor.");
                return false;
            }
        },
        clickCursos() {
            var row = this.parentNode.parentNode;
            var curso = tblCursos.row(row).data();
            if (this.innerHTML == "Detalle") {
                fn.BlockScreen(true);
                cursosFn.editarCurso(curso);
            } else if (this.innerHTML == "Ver") {
                fn.BlockScreen(true);
                cursosFn.generatePdf(curso.cursoId);
            } else if (this.innerHTML == "Aprobar") {
                cursosFn.aprobar(curso.cursoId);
            }
        },
        clickAgregar() {
            $("#frmParticipante")[0].reset();
            $("#validFormas").hide();
            $('#btnAdd').removeData('participanteId');
            $("#modalParticipante").modal("show");
        },
        inputParticipante() {
            var total = (parseFloat($("#txtEfectivo").val()) || 0) + (parseFloat($("#txtDeposito").val()) || 0) + (parseFloat($("#txtCheque").val()) || 0) + (parseFloat($("#txtTarjeta").val()) || 0);
            total = (total).toLocaleString('es-mx', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2
            });
            $("#txtTotalP").val(total);
        },
        editarCurso(curso) {

            $('#btnSave').removeData('cursoId');
            $("#btnSave").data("cursoId", curso.cursoId);
            $("#slcCentroCostos").val(curso.centroCostosId);
            $("#slcSede").val(curso.sedeId);
            $("#txtLugar").val(curso.lugarCurso);
            $("#slcCursoTipo").val(curso.cursoTipoId);
            fn.SetDate("#txtFecha", curso.fechaCurso);
            $("#slcInstructor1").val(curso.instructorId1);
            $("#slcComision1").val(curso.comision1);
            $("#slcInstructor2").val(curso.instructorId2);
            $("#slcComision2").val(curso.comision2 == 0 ? 5 : curso.comision2);
            $("#txtEfectivoA").val(curso.efectivo);
            $("#txtCheque1").val(curso.chequeTans);
            $("#txtFecha1").val(curso.fechachequeTans);
            $("#txtNoCheque1").val(curso.numeroChequeTans);

            $("#divGenerales").show();
            $("#divTabla").hide();
            $("#divAnticipos").show();
            $("#divGastos").show();
            lstParticipantes = curso.participantes.slice();
            consecutivo = lstParticipantes.length;
            cursosFn.loadTableParticipante(lstParticipantes);
            cursosFn.loadTableGastos(curso.gastos);
            fn.BlockScreen(false);
        },
        focusout() {
            if (this.value == "") { this.value = 0; }
        },
        addParticipante(e) {
            e.preventDefault();
            if (cursosFn.validFormasPago()) {
                var cons = $("#btnAdd").data("participanteId");
                if (cons === undefined) {
                    consecutivo += 1;
                    lstParticipantes.push(
                        {
                            participanteId: consecutivo,
                            nombre: $("#txtNombre").val(),
                            apellido: $("#txtApellido").val(),
                            efectivo: $("#txtEfectivo").val(),
                            deposito: $("#txtDeposito").val(),
                            cheque: $("#txtCheque").val(),
                            tarjeta: $("#txtTarjeta").val(),
                            email: $("#txtEmail").val(),
                            celular: $("#txtCelular").val()
                        });
                } else {
                    var participante = lstParticipantes.filter(function (e) { return e.participanteId === cons; });
                    participante[0].nombre = $("#txtNombre").val();
                    participante[0].apellido = $("#txtApellido").val();
                    participante[0].efectivo = $("#txtEfectivo").val();
                    participante[0].deposito = $("#txtDeposito").val();
                    participante[0].cheque = $("#txtCheque").val();
                    participante[0].tarjeta = $("#txtTarjeta").val();
                    participante[0].email = $("#txtEmail").val();
                    participante[0].celular = $("#txtCelular").val();
                }
                cursosFn.loadTableParticipante(lstParticipantes);
                $("#modalParticipante").modal("hide");
            }
        },
        loadTableParticipante(lst) {
            document.getElementById("tblParticipantes").deleteTFoot();
            tblParticipantes = $('#tblParticipantes').DataTable({
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
            $("#tblParticipantes").append(tfoot);
        },
        editParticipante() {
            var row = this.parentNode.parentNode;
            var participante = tblParticipantes.row(row).data();
            $("#txtNombre").val(participante.nombre);
            $("#txtApellido").val(participante.apellido);
            $("#txtEfectivo").val(participante.efectivo);
            $("#txtDeposito").val(participante.deposito);
            $("#txtCheque").val(participante.cheque);
            $("#txtTarjeta").val(participante.tarjeta);
            $("#txtEmail").val(participante.email);
            $("#txtCelular").val(participante.celular);
            $('#btnAdd').removeData('participanteId');
            $("#btnAdd").data("participanteId", participante.participanteId);
            $("#modalParticipante").modal("show");
        },
        deleteParticipante() {
            var row = this.parentNode.parentNode;
            var participante = tblParticipantes.row(row).data();
            lstParticipantes = lstParticipantes.filter(function (e) { return e.participanteId !== participante.participanteId; });
            cursosFn.loadTableParticipante(lstParticipantes);
        },
        loadTableGastos(lst) {
            document.getElementById("tblGastos").deleteTFoot();
            tblGastos = $('#tblGastos').DataTable({
                data: lst,
                columns: [
                    { data: 'instructor' },
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
        inputGasto() {
            var subtotal = (parseFloat($("#txtSubtotal").val()) || 0);
            var iva = (parseFloat($("#txtIva").val()) || 0);
            $("#txtTotal").val(subtotal + iva);
        },
        aprobar(cursoId) {
            alertify.confirm('Aprobar rendición', '¿Estas seguro que deseas aprobar esta rendición?',
                function () {
                    fn.BlockScreen(true);
                    fn.Api("Cursos/Aprobar/" + cursoId, "GET", "")
                        .done(function (data) {
                            alertify.alert("Cursos", data);
                            cursosFn.getCursos();
                        })
                        .fail(function (data) {
                            fn.BlockScreen(false);
                            console.log(data);
                            alertify.alert("Cursos", data);
                        });
                }, function () {
                    fn.BlockScreen(false);
                });
        },
        generatePdf(cursoId) {
            fn.Api("Cursos/ReporteCurso/" + cursoId, "GET", "")
                .done(function (data) {
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64," + data + "'></iframe>");
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Rendir", data);
                });
        },
        validFormasPago() {
            var sumFormas = parseFloat($("#txtEfectivo").val()) + parseFloat($("#txtDeposito").val()) + parseFloat($("#txtCheque").val()) + parseFloat($("#txtTarjeta").val())
            if (sumFormas > 0) {
                $("#validFormas").hide();
                return true;
            }
            else {
                $("#validFormas").show();
                return false;
            }
        },
    };


    cursosFn.init();
});
