/// <reference path="jquery-1.9.0.js" />
/// <reference path="jquery-ui-1.9.2.js" />


/* Copyright (c) 2013 Livefrog Apps */


(function ($) {
    $.fn.fileInput = function (options) {

        var opts = $.extend({ label: 'Attach a file',
            changed: function () { },
            cleared: function () { } 
        }, options);

        // get the container
        this.wrap('<div></div>');
        var container = this.parent('div');

        // create the wrap
        this.wrap('<div class="fileinputs" />')

        // and add the overlay
        var overlay = $('<div class="overlay" />').append($('<a href="javascript:void()">' + opts.label + ' &raquo;</a>'));
        this.after(overlay);


        // define the clearhandler
        var clearHandler = $('<a href="" style="font-size:12px">Clear</a>').on('click', function (event) {
            var cloned = $('input[type=file]', container).clone(true);
            $('input[type=file]', container).replaceWith(cloned);
            $('.file_selected').html('');
            $(this).hide();
            if (opts.cleared != undefined) opts.cleared();
            event.preventDefault();
        }).hide();

        // and append element to show name of file selected
        container.append($('<p style="margin-bottom:5px;color: #000"><span class="file_selected" ></span>&nbsp;</p>').append(clearHandler));

        // change event handler
        this.on('change', function (event) {
            $('.file_selected',container).html($(this).val());
            $(clearHandler).show();
            if (opts.changed != undefined) opts.changed();
        });

        // don't focus
        this.blur();

    };
})(jQuery);


$(function () {


    $('input[type=file]').each(function (index) {
        var this_label = "Browse for a file";

        if ($(this).attr('title')) {
            this_label = $(this).attr('title');
        }

        $(this).fileInput({ label: this_label });
    })


})