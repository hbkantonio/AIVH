var fn = {
    RequestToken(username, password) {
        $.post("token",
            $.param({
                username: username,
                password: password,
                grant_type: 'password',
            })
        ).done(function (token) {
            localStorage.setItem("token_id", JSON.stringify(token));
            window.location.href = 'index.html';
            }).fail(function (error) {
            console.log(error);
            alertify.alert("Login", error.responseJSON.error_description );
        }
        ).always(function () {
            fn.BlockScreen(false);
           
            });
    },
    GetToken() {
        var token_id = (JSON.parse(localStorage.getItem("token_id"))).access_token;
        return token_id;
    },
    Api(url, type, data) {
        var dfd = $.Deferred();
        $.ajax({
            url: "api/" + url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + fn.GetToken());
            },
            type: type,
            data: data,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
            .done(function (data) {
                dfd.resolve(data);
            })
            .fail(function (error) {
                console.log(error);
                dfd.reject(error.responseJSON.Message);
            });

        return dfd.promise();
    },
    LoadMenu(tokenId) {
        $.ajax({
            url: 'api/General/GetMenu',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + tokenId);
            },
            type: 'Get',
            data: '',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
            .done(function (data) {
                var Menu = '';
                var Items = [];


                Menu += '<div><div class="sidenav-header"><img src="img/logo.png" width="70" height="80" /> </div >';

                if ($(data)) {
                    Menu += '<ul class="sidenav-menu">';
                }

                $(data).each(function () {
                    Menu += '<li>' +
                        '<a id= "m' + this.menuId + '" href="' + 'javascript:;' + '" data-sidenav-dropdown-toggle>' +
                        '<span class="sidenav-link-icon" >' +
                        '<i class="' + this.icono + '"  aria-hidden="true"></i>' +
                        '</span>' +
                        '<span class="sidenav-link-title">' +
                        this.descripcion +
                        '</span>' +
                        '<span class="sidenav-dropdown-icon show" data-sidenav-dropdown-icon>' +
                        '<i class="fa fa-chevron-down" aria-hidden="true"></i>' +
                        '</span>' +
                        '<span class="sidenav-dropdown-icon" data-sidenav-dropdown-icon>' +
                        '<i class="fa fa-chevron-up" aria-hidden="true"></i>' +
                        '</span>' +
                        '</a>';

                    if ($(this.Submenus)) {
                        Menu += '<ul class="sidenav-dropdown" data-sidenav-dropdown>';
                    }

                    $(this.Submenus).each(function () {
                        Menu += '<li>' +
                            '<a id="s' + this.submenuId + '" class="submenu" href="' + this.link + '" data-sidenav-submenu>' +
                            this.descripcion +
                            '</a >' +
                            '</li > ';
                        var submenu = {
                            id: ('#s' + this.submenuId)
                        };
                        Items.push(submenu);
                    });

                    if ($(this.Submenus)) {
                        Menu += '</ul>';
                    }

                    if ($(this)) {
                        Menu += '</li>';
                    }
                });

                if ($(data)) {
                    Menu += '</ul></div>';
                }


                $('#menu').append(Menu);

            })
            .fail(function (data) {
                console.log('---------------Error-------------');
                console.log(data);
            });
    },
    BlockScreen(option) {
        if (option) {
            $.blockUI({
                message: $('#load'),
                css: { backgroundColor: '#48525e', color: '#fff', border: 'none' }
            });
        }
        else {
            $.unblockUI({ onUnblock: function () { } });
        }
    },
    SetDate(id, date) {
        $(id).datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true
        });
        if (date != "")
            $(id).datepicker("setDate", date);
    },
    GetCentroCostos(tipo) {
        fn.Api("General/GetCentroCostos/" + tipo, "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcCentroCostos').append(option);
                });

                if ($('#slcCentroCostos').length > 0) {
                    $('#slcCentroCostos').val($('#slcCentroCostos option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    },
    GetInstructor(id) {
        fn.Api("General/GetInstructor", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#' + id).append(option);
                });

                if ($('#' + id).length > 0) {
                    $('#' + id).val($('#' + id + ' option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    },
    GetComprobanteTipo() {
        fn.Api("General/GetComprobanteTipo", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcComprobanteTipo').append(option);
                });

                if ($('#slcComprobanteTipo').length > 0) {
                    $('#slcComprobanteTipo').val($('#slcComprobanteTipo option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    },
    GetConcepto() {
        var dfd = $.Deferred();
        fn.Api("General/GetConcepto", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcConcepto').append(option);
                    dfd.resolve(data);
                });
                if ($('#slcConcepto').length > 0) {
                    $('#slcConcepto').val($('#slcConcepto option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
                dfd.reject(data);
            });
        return dfd.promise();
    },
    GetSubConcepto(conceptoId) {
        var dfd = $.Deferred();
        $('#slcSubConcepto').empty();
        fn.Api("General/GetSubConcepto/" + conceptoId, "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcSubConcepto').append(option);
                });

                if ($('#slcSubConcepto').length > 0) {
                    $('#slcSubConcepto').val($('#slcSubConcepto option:first').val());
                }
                dfd.resolve(data);
            })
            .fail(function (data) {
                console.log(data);
                dfd.reject(data);
            });
        return dfd.promise();
    },
    GetSede() {
        fn.Api("General/GetSede", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcSede').append(option);
                });
                if ($('#slcSede').length > 0) {
                    $('#slcSede').val($('#slcSede option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    },
    GetCursoTipo() {
        fn.Api("General/GetTipoCurso", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcCursoTipo').append(option);
                });
                if ($('#slcCursoTipo').length > 0) {
                    $('#slcCursoTipo').val($('#slcCursoTipo option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    },
    GetEventoTipo() {
        fn.Api("General/GetTipoEvento", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcEventoTipo').append(option);
                });
                if ($('#slcEventoTipo').length > 0) {
                    $('#slcEventoTipo').val($('#slcEventoTipo option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    },
    GetRol()
    {
        fn.Api("General/GetRol", "GET", "")
            .done(function (data) {
                $(data).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.text);
                    option.val(this.value);
                    $('#slcRol').append(option);
                });
                if ($('#slcRol').length > 0) {
                    $('#slcRol').val($('#slcRol option:first').val());
                }
            })
            .fail(function (data) {
                console.log(data);
            });
    }
};