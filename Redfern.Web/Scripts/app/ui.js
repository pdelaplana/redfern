function UI() {

    function Part(part) {
        this.binded_element = '';
        return $.extend(part, {
            element: '',
            bindTo: function (element) {
                this.element = element;
                var deferred = $.Deferred();
                ko.applyBindings(this, $(element).get(0));
                deferred.resolve(this);
                return deferred.promise();
            }
        })
    }


    var appTitle = ko.observable("My Application");

    return {

        appTitle: appTitle,

        setWindowTitle: function (title) {
            document.title = title + ' - ' + appTitle();
        },

        addPart: function(name, part){
            this[name] = new Part(part);
            return this[name];
        },

        extend: function (object) {
            if (object == undefined) object = {};
            return $.extend(object, this);

        },

        block: function (options) {
            options = $.extend({ message: 'Please wait...', element: '' }, options)
            if (options.element == '') {
                $.blockUI({ message: '<div class="fg-darker"><h2>' + options.message + '</h2><img src="/content/images/ajax-loader-bar-1.gif" alt="please wait..." /></div>' });
            } else {
                $(options.element).block({ message: '<div class="fg-darker"><h2>' + options.message + '</h2><img src="/content/images/ajax-loader-bar-1.gif" alt="please wait..." /></div>' });
            }
        },

        unblock: function (options) {
            options = $.extend({ element: '' }, options)

            if (options.element == '') {
                $.unblockUI();
            } else {
                $(options.elements).unblock();
            }

        }

    }

}