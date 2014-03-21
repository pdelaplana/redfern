function Router(contentContainer, rootPath) {

    var sammy = Sammy(contentContainer, function () {
        this.helpers({
            loadLocation: function (url, initialize) {
                this
                 .load(url, { cache: false })
                 .swap(function () {
                     initialize(this.element_selector);
                 });
            }
        });

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