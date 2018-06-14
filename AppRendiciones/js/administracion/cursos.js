$(function () {
    var tblCursos, tblParticipantes, lstParticipantes = [], consecutivo = 0;
    var cursosFn = {
        init() {
            //Cargar Catolagos
            this.getCursos();
            fn.GetCentroCostos();
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
                            { data: 'instructor1' },
                            { data: 'instructor2' },
                            { data: 'fechaCurso' },
                            { data: 'estatus' },
                            {
                                data: null,
                                render: function (data, f, d) {
                                    return '<a class="btn btn-info btn-sm" href="" onclick="return false;">Editar</a> ';
                                },
                                orderable: false,
                                className: 'text-center'
                            },
                            {
                                data: null,
                                render: function (data, f, d) {
                                    return '<a class="btn btn-success btn-sm" href="" onclick="return false;">Ver</a> ';
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
        newCurso() {
            consecutivo = 0;
            $('#btnSave').removeData('cursoId');
            $("#frmCurso")[0].reset();
            $("#divGenerales").show();
            $("#divTabla").hide();
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
            if (this.innerHTML == "Editar") {
                fn.BlockScreen(true);
                cursosFn.editarCurso(curso);
            } else {
                fn.BlockScreen(true);
            }
        },
        clickAgregar() {
            $("#frmParticipante")[0].reset();
            $('#btnAdd').removeData('participanteId');
            $("#modalParticipante").modal("show");
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
            $("#slcComision2").val(curso.comision2);

            $("#divGenerales").show();
            $("#divTabla").hide();
            lstParticipantes = curso.participantes;
            consecutivo = lstParticipantes.length;
            cursosFn.loadTableParticipante(lstParticipantes);
            fn.BlockScreen(false);
        },
        focusout() {
            if (this.value == "") { this.value = 0; }
        },
        addParticipante(e) {
            e.preventDefault();
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
        },
        loadTableParticipante(lst) {
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

        inputGasto() {
            var subtotal = (parseFloat($("#txtSubtotal").val()) || 0);
            var iva = (parseFloat($("#txtIva").val()) || 0);
            $("#txtTotal").val(subtotal + iva);
        },
        generatePdf(cursoId) {
            fn.Api("Gastos/ReporteGastos/" + gastoId, "GET", "")
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
        }

    };


    cursosFn.init();
});
