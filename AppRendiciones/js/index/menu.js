(function ($) {
    'use strict';

    var defaults = {};

    function Sidenav(element, options) {
        this.$el = $(element);
        this.opt = $.extend(true, {}, defaults, options);
        this.init(this);
    }

    Sidenav.prototype = {
        init: function (self) {
            self.initToggle(self);
            self.initDropdown(self);
            self.initSubMenu(self);
        },
        initToggle: function (self) {
            $(document).on('click', function (e) {
                var $target = $(e.target);

                if ($target.closest(self.$el.data('sidenav-toggle'))[0]) {
                    self.$el.toggleClass('show');
                    $('body').toggleClass('sidenav-no-scroll');
                    self.toggleOverlay();

                } else if (!$target.closest(self.$el)[0]) {
                    self.$el.removeClass('show');
                    $('body').removeClass('sidenav-no-scroll');
                    self.hideOverlay();
                }
            });
        },
        initDropdown: function (self) {
            self.$el.on('click', '[data-sidenav-dropdown-toggle]', function (e) {
                var $this = $(this);
                var ul = $($this[0].parentNode.children[1]).css("display");

                if (ul == "none") {
                    $($(document).find('[data-sidenav-dropdown-toggle]')).each(function () {
                        if ($(this.parentNode.children[1]).css("display") == "block") {

                            $(this)
                                .next('[data-sidenav-dropdown]')
                                .slideToggle('fast');
                            $(this)
                                .find('[data-sidenav-dropdown-icon]')
                                .toggleClass('show');
                        }
                    });
                }
                //cuando no tienen sub menu
                if (ul == undefined) {
                    //eliminar active de menu
                    $($('nav').find('[data-sidenav-dropdown-toggle]')).each(function () {
                        if ($(this.parentNode.children[1]).css("display") == "block") {

                            $(this)
                                .next('[data-sidenav-dropdown]')
                                .slideToggle('fast');
                            $(this)
                                .find('[data-sidenav-dropdown-icon]')
                                .toggleClass('show');
                        }

                        $(this).removeClass("active");
                    });

                    //eliminar active de submenu
                    $($('nav').find('.active2')).each(function () {

                        $(this).removeClass("active2");
                    });

                    $this.addClass("active");
                }

                $this
                    .next('[data-sidenav-dropdown]')
                    .slideToggle('fast');

                $this
                    .find('[data-sidenav-dropdown-icon]')
                    .toggleClass('show');

                e.preventDefault();
            });
        },
        initSubMenu: function (self) {

            self.$el.on('click', '[data-sidenav-submenu]', function (e) {
                var $this = $(this);
                $('#sidenav-toggle').click();
                //eliminar active de menu
                $($('nav').find('[data-sidenav-dropdown-toggle]')).each(function () {
                    $(this).removeClass("active");
                });

                //eliminar active de submenu
                $($('nav').find('.active2')).each(function () {

                    $(this).removeClass("active2");
                });

                $($this[0].parentNode.parentNode.parentNode.children[0]).addClass("active");
                $this.addClass("active2");
            });
        },
        toggleOverlay: function () {
            var $overlay = $('[data-sidenav-overlay]');

            if (!$overlay[0]) {
                $overlay = $('<div data-sidenav-overlay class="sidenav-overlay"/>');
                $('body').append($overlay);
            }

            $overlay.fadeToggle('fast');
        },
        hideOverlay: function () {
            $('[data-sidenav-overlay]').fadeOut('fast');
        }
    };

    $.fn.sidenav = function (options) {
        return this.each(function () {
            if (!$.data(this, 'sidenav')) {
                $.data(this, 'sidenav', new Sidenav(this, options));
            }
        });
    };
})(window.jQuery);

$('[data-sidenav]').sidenav();
var size = false;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36251023-1']);
_gaq.push(['_setDomainName', 'jqueryscript.net']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

