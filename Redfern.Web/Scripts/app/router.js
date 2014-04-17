function Router(contentContainer, rootPath) {

    var sammy = Sammy(contentContainer, function () {
        this.helpers({
            loadLocation: function (url, initialize) {
                $.blockUI({ message: '<div class="fg-darken"><h2>Loading...</h2><img src="/content/images/ajax-loader-bar-1.gif" alt="" /></div>' });
                this
                 .load(url, { cache: false })
                 .swap(function () {
                     initialize(this.element_selector);
                     $.unblockUI();
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

        registerPostRoute: function (route, found) {
            sammy.post(route, found);
        },


        
        run: function (path) {
            sammy.run(path);
        }

    }
}