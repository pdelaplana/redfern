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

        }
    }

}