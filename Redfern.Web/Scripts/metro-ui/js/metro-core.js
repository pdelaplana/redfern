
(function($){
    $.Metro = function(params){
        params = $.extend({
        }, params);
    };

    $.Metro.getDeviceSize = function(){
        var device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var device_height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        return {
            width: device_width,
            height: device_height
        }
    }

})(jQuery);

$(function(){
    $('html').on('click', function(e){
        $('.dropdown-menu').each(function(i, el){
            if (!$(el).hasClass('keep-open') && $(el).css('display')=='block') {
                $(el).hide();
            }
        });
    });
});

$(function(){
    $(window).on('resize', function(){
        if (METRO_DIALOG) {
            /*
            var top = 0, left = 0;
            if ($.Dialog.settings.recenter) {
                top = ($(window).height() - METRO_DIALOG.outerHeight()) / 2;
                left = ($(window).width() - METRO_DIALOG.outerWidth()) / 2;
            } else {
                top = $(METRO_DIALOG).position().top;
                left = $(METRO_DIALOG).position().left;
            }
            
            METRO_DIALOG.css({
                top: top, left: left
            });
            */
            $.Dialog.autoResize();
        }
    });
});
