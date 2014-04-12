function Router(contentContainer, rootPath) {

    var sammy = Sammy(contentContainer, function () {
        this.helpers({
            loadLocation: function (url, initialize) {
                $(this.element_selector).block({ message: '<div class="fg-color-darken"><h2>Loading page...</h2><img src="/content/images/ajax-loader.gif" alt="" /></div>' });
                $(this.element_selector).html('');
                this
                 .load(url, { cache: false })
                 .swap(function () {
                     initialize(this.element_selector);
                     $(this.element_selector).unblock();
                 });
            }
        });

        this.swap = function (content, callback) {
            var context = this;
            
            context.$element().html(content);
            if (callback) {
                callback.apply();
            }

            
            /*
            context.$element().fadeOut('fast', function () {
                context.$element().html(content);
                if (callback) {
                    callback.apply();
                }
                context.$element().fadeIn('fast', function () {});
            });

	        context.$element().html(content);
	        if (callback) {
	            callback.apply();
	        }
	        legis.app.ui.unblock();

            

            */

            
        };

        this.error = function (message, original_error) {

            alert(message);
        }

        this.get('app/#/', function (context) {
            context.redirect('#/boards');
        });

        this.notFound = function () {
            alert('Not found');
        }

    });

    return {

        go: function (route) {
            sammy.setLocation(route);
        },

        registerRoute: function (route, found) {
            sammy.get(route, found);
        },

        
        run: function (path) {
            sammy.run(path);
        }

    }
}