$(function () {

    var passwordFn = {
        init: function () {
            $('#frmPassword').submit(passwordFn.changePassword);
        },
        changePassword: function (e) {
            e.preventDefault();
            fn.BlockScreen(true);
            var accountPassword = {
                password: $('#txtPassword').val(),
                newPassword: $('#txtNewPassword').val(),
                confirmPassword: $('#txtConfirmPassword').val()
            }

            fn.Api("Usuarios/ChangePassword", "POST", JSON.stringify(accountPassword))
                .done(function (data) {
                    alertify.alert('Actualización de password', data, function () {
                        localStorage.removeItem("token_id");
                        window.location.href = "login.html";
                    });
                })
                .fail(function (data) {
                    console.log(data);
                    fn.BlockScreen(false);
                    alertify.alert('Actualización de password', data);
                });
        }
    }

    passwordFn.init();
});