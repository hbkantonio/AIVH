$(function () {
    var loginFn = {
        init: function () {
            $('#frmSign').submit(function (e) {
                e.preventDefault();
                fn.BlockScreen(true);
                loginFn.Connect();
            });
        },
        Connect: function () {
            fn.RequestToken($('#txtUsername').val(), $('#txtPassword').val());
        }
    };

    loginFn.init();
});