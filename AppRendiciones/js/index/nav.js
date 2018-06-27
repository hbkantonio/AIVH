$(function () {
    var navFn = {
        init () {
            fn.LoadMenu(fn.GetToken());
            navFn.getDataUser(fn.GetToken());
            $(document.body).on('click', '.submenu', this.openView);
            $(window).resize(navFn.resize);
            navFn.resize();
            $("#btnChangePass").click(navFn.changePass);
            $("#btnExit").click(navFn.exitApp);
        },
        openView(e) {
            e.preventDefault();
            var $this = $(this);
            $('#dynamic').empty();
            var url = $this.attr("href");
            $('#dynamic').load(url, function () {
                alertify.alert().destroy();
                alertify.prompt().destroy();
                alertify.confirm().destroy();
            });
            return false;
        },
        resize () {
            if ($(window).width() < 700 && size == false) {
                size = true;
                if ($('.sidenav.show')[0] != undefined) { $("#sidenav-toggle").click(); }
                $("#personName").css('display', 'none');
                //console.log(size);
            } else if ($(window).width() > 800 && size == true) {
                size = false;
                $("#personName").css('display', 'block');
                //console.log(size);
            }
        },
        changePass () {
            $("#dynamic").load('views/index/changePassword.html');
        },
        exitApp () {
            localStorage.removeItem("token_id");
            window.location.href = "login.html";
        },
        getDataUser (tokenId) {
            $.ajax({
                url:"api/General/GetPerfil",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + tokenId);
                },
                type: 'Get',
                data: '',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(function (data) {
                    $("#userName").text(data.nombre);
                    $("#roleName").text(data.rol);
                    $('#personName').text(data.nombre);
                    navFn.createCarousel(5, "carousel"); 
                    $("#divUser").addClass("user-male");
                })
                .fail(function (error) {
                    console.log(error);
                });
        },
        createCarousel (lenImg, fileImg) {
            var indicators = "", inner = "";
            for (i = 0; i < lenImg; i++) {
                var active = (i == 0 ? "active" : "");
                indicators += '<li data-target="#carouselExampleIndicators" data-slide-to="' + i + '" class="' + active + '"></li>';
                inner += '<div class="carousel-item ' + active + '"><img class="d-block w-100" src="img/' + fileImg + '/' + (i + 1) + '.jpg" alt= "First slide"></div>';
            }
            inner += '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span ><span class="sr-only">Previous</span></a><a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a>';

            var carousel = '<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">'
                + '<ol class="carousel-indicators">' + indicators + '</ol>'
                + '<div class="carousel-inner">' + inner + '</div></div>';
            $("#dynamic").empty();
            $("#dynamic").append(carousel);
        }
    };

    navFn.init();
});