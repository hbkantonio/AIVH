$(function () {
    var tblUsuarios;

    var usuariosFn = {
        init() {
            //Cargar Catolagos
            this.getUsuarios();
            fn.GetRol();

            //inicializar eventos

            $("#btnNuevo").click(this.newUsuario);

            $("#frmUsuario").submit(this.saveUsuario);
            $("#tblUsuarios").on("click", "a", this.editarUsuarios);

            $('#txtBusqueda').keyup(function () {
                tblUsuarios.search($(this).val()).draw();
            });
            $('#slcLength').change(function () {
                var info = tblUsuarios.page.info();
                tblUsuarios.page.len($(this).val()).draw();
            });

        },
        getUsuarios() {
            fn.BlockScreen(true);
            fn.Api("Usuarios/Get", "GET", "")
                .done(function (data) {
                    tblUsuarios = $('#tblUsuarios').DataTable({
                        data: data,
                        columns: [
                            { data: 'UsuarioId' },
                            {
                                data: null,
                                render: function (data, f, d) {
                                    return data.Nombre + " " + data.Paterno + " " + data.Materno
                                }
                            },
                            { data: 'Rol' },
                            { data: 'Estatus' },
                            {
                                data: null,
                                render: function (data, f, d) {
                                    return '<a class="btn btn-success btn-sm" href="" onclick="return false;">Editar</a> ';
                                },
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
                    fn.BlockScreen(false);
                })
                .fail(function (data) {
                    fn.BlockScreen(false);
                    console.log(data);
                    alertify.alert("Usuarios", data);
                });


        },
        newUsuario() {
            $('#btnAdd').removeData('usuarioId');
            $("#frmUsuario")[0].reset();
            $("#slcPassword").prop("required", true);
            $("#slcPassword2").prop("required", true);
            $("#modalUsuarios").modal("show");
        },
        saveUsuario(e) {
            e.preventDefault();
            var $frm = $('#frmUsuario');
            if ($frm[0].checkValidity() && usuariosFn.validPass()) {
                $("#modalUsuarios").modal("hide");
                fn.BlockScreen(true);
                var usuarioId = $("#btnAdd").data("usuarioId");

                if (usuarioId === undefined) {
                    var usuario =
                        {
                            Nombre: $("#txtNombre").val(),
                            Paterno: $("#txtPaterno").val(),
                            Materno: $("#txtMaterno").val(),
                            Password: $("#slcPassword2").val(),
                            RolId: $("#slcRol").val(),
                            EstatusId: $("#slcEstatus").val()
                        };
                } else {
                    var usuario =
                        {
                            usuarioId,
                            NickName: usuarioId,
                            Nombre: $("#txtNombre").val(),
                            Paterno: $("#txtPaterno").val(),
                            Materno: $("#txtMaterno").val(),
                            Password: $("#slcPassword2").val(),
                            RolId: $("#slcRol").val(),
                            EstatusId: $("#slcEstatus").val()
                        };
                }

                fn.Api("Usuarios/SaveUsuario", "Post", JSON.stringify(usuario))
                    .done(function (data) {
                        $('#btnAdd').removeData('usuarioId');
                        $("#frmUsuario")[0].reset();
                        $("#modalUsuarios").modal("hide");
                        usuariosFn.getUsuarios();
                        alertify.alert("Usuarios", data.message);
                    })
                    .fail(function (data) {
                        fn.BlockScreen(false);
                        console.log(data);
                        $("#modalUsuarios").modal("show");
                        alertify.alert("Usuarios", data);
                    });
            }
        },
        validPass() {
            if ($("#slcPassword").val() == $("#slcPassword2").val()) {
                return true;
            }
            else {
                alertify.alert("Usuarios", "El primer password con coincide con el segundo.");
                return false;
            }
        },
        editarUsuarios() {
            var row = this.parentNode.parentNode;
            var usuario = tblUsuarios.row(row).data();
            $('#btnAdd').removeData('usuarioId');
            $('#btnAdd').data('usuarioId', usuario.UsuarioId);
            $("#frmUsuario")[0].reset();
            $("#txtNombre").val(usuario.Nombre);
            $("#txtPaterno").val(usuario.Paterno);
            $("#txtMaterno").val(usuario.Materno);
            $("#slcRol").val(usuario.RolId);
            $("#slcEstatus").val(usuario.EstatusId);
            $("#slcPassword").prop("required", false);
            $("#slcPassword2").prop("required", false);
            $("#modalUsuarios").modal("show");
        }
    };

    usuariosFn.init();
});
