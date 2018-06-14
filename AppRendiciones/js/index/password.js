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

			$.ajax({
				url: specs.apiPath + "/Universal/ChangePassword",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer ' + fn.GetToken(specs.tokenItem));
				},
				type: 'Post',
				data: JSON.stringify(accountPassword),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
			})
				.done(function (data) {
					alertify.alert('Actualización de password', data.message, function () {
						localStorage.removeItem("token_id");
						window.location.href = "signin.html";
					});
				})
				.fail(function (error) {
					alertify.alert('Actualización de password', error.responseJSON.message);
				})
				.always(function () {
					fn.BlockScreen(false);
				});
		}
	}

	passwordFn.init();
});