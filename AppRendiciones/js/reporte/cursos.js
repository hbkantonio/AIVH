$(function () {
    var tblCursos, tblGastos, lstGastos = [], consecutivo = 0;
    var cursosFn = {
        init() {
            //Cargar Catolagos
            this.getCursos();
            fn.GetConcepto()
                .done(function () {
                    cursosFn.changeConcepto();
                });
            fn.GetComprobanteTipo();
            //inicializar eventos
            fn.SetDate("#txtFechaComprobante", "");
            fn.SetDate("#txtFecha1", "");
            $("#btnreturn").click(this.returnRendicion);
            $("#frmCurso").submit(this.saveRendicion);
            $("#tblCursos").on("click", "a", this.clickCursos);
            $("#txtEfectivo").focusout(this.focusout);
            $("#txtCheque1").focusout(this.focusout);
            $("#txtCheque1").on("input", this.inputAnticipo);
            $("#slcConcepto").change(this.changeConcepto);
            $("#btnNew").click(this.clickAgregar);
            $("#txtSubtotal").on("input", this.inputGasto);
            $("#txtIva").on("input", this.inputGasto);
            $("#frmGasto").submit(this.addGasto);
            $('#tblGastos').on('click', 'button', this.deleteGasto);
            $('#tblGastos').on('click', 'a', this.editGasto);

            $('#txtBusqueda').keyup(function () {
                tblCursos.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblCursos.page.info();
                tblCursos.page.len($(this).val()).draw();
            });

        },
        getCursos() {
            fn.BlockScreen(true);
            fn.Api("Cursos/Get", "GET", "")
                .done(function (data) {
                    tblCursos = $('#tblCursos').DataTable({
                        data: data,
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
                    alertify.alert("Cursos", data);
                });

        },
        loadTableParticipante(lst) {
            document.getElementById("tblParticipantes").deleteTFoot();
            var tblParticipantes = $('#tblParticipantes').DataTable({
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
            $("#tblParticipantes").append(tfoot);
        },
        returnRendicion() {
            $("#divGenerales").hide();
            $("#divTabla").show();
        },
        saveRendicion(e) {
            e.preventDefault();
            var $frm = $('#frmCurso');
            if ($frm[0].checkValidity() && cursosFn.validGastos()) {
                fn.BlockScreen(true);
                var cursoId = $("#btnSave").data("cursoId");

                var curso =
                    {
                        cursoId,
                        efectivo: $("#txtEfectivo").val(),
                        chequeTans: $("#txtCheque1").val(),
                        fechachequeTans: $("#txtFecha1").val(),
                        numeroChequeTans: $("#txtNoCheque1").val(),
                        gastos: lstGastos
                    };


                fn.Api("Cursos/SaveRendicion", "Post", JSON.stringify(curso))
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
        clickCursos() {
            var row = this.parentNode.parentNode;
            var curso = tblCursos.row(row).data();
            if (this.innerHTML == "Rendir gastos") {
                fn.BlockScreen(true);
                cursosFn.editarCurso(curso);
            } else {
                cursosFn.generatePdf(curso.cursoId);
                fn.BlockScreen(true);
            }
        },
        editarCurso(curso) {
            $('#btnSave').removeData('cursoId');
            $("#btnSave").data("cursoId", curso.cursoId);
            $("#slcCentroCostos").val(curso.centroCostos);
            $("#slcSede").val(curso.sede);
            $("#txtLugar").val(curso.lugarCurso);
            $("#slcCursoTipo").val(curso.cursoTipo);
            $("#txtFecha").val(curso.fechaCurso);
            $("#slcInstructor1").val(curso.instructor1);
            $("#slcComision1").val(curso.comision1);
            $("#slcInstructor2").val(curso.instructor2);
            $("#slcComision2").val(curso.comision2);
            $("#txtEfectivo").val(curso.efectivo);
            $("#txtCheque1").val(curso.chequeTans);
            $("#txtFecha1").val(curso.fechachequeTans);
            $("#txtNoCheque1").val(curso.numeroChequeTans);
            if (curso.chequeTans == 0) {
                $("#txtFecha1").prop("disabled", true);
                $("#txtNoCheque1").prop("disabled", true);
            } else {
                $("#txtFecha1").prop("disabled", false);
                $("#txtNoCheque1").prop("disabled", false);
            }

            $("#divGenerales").show();
            $("#divTabla").hide();
            cursosFn.instructores(curso);
            cursosFn.loadTableParticipante(curso.participantes);
            lstGastos = curso.gastos.slice();
            consecutivo = lstGastos.length;
            cursosFn.loadTableGastos(lstGastos);
            fn.BlockScreen(false);
        },
        instructores(curso) {
            $('#slcInstructor').empty();
            var option = $(document.createElement('option'));
            option.text(curso.instructor1);
            option.val(curso.instructorId1);
            $('#slcInstructor').append(option);

            if (curso.instructorId2 != 0)
            {
                var option1 = $(document.createElement('option'));
                option1.text(curso.instructor2);
                option1.val(curso.instructorId2);
                $('#slcInstructor').append(option1);
            }

            $('#slcInstructor').val($('#slcInstructor option:first').val());
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

            cursosFn.loadTableGastos(lstGastos);
            $("#modalGastos").modal("hide");
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
            var tfoot = "<tfoot><tr> <td colspan='10' class='text-right font-weight-bold'>Total: " + (Total).toLocaleString('es-mx', {
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
            cursosFn.loadTableGastos(lstGastos);
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
                    alertify.alert("Cursos", data);
                });
        }
    };


    cursosFn.init();
});
