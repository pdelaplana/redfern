function Application(config) {

    config = $.extend({
        appTitle : 'My Application',
        appContainer: 'application-container'
    }, config);

    function ModulesArray() {
        this.add = function (name, module) {
            this[name] = module;
        }
    }
    ModulesArray.prototype = [];
    
    var ui = new UI(),
        router = new Router(config.appContainer),
        modules = new ModulesArray()

    ui.appTitle(config.appTitle);

    return {

        ui: ui,

        router: router,
    
        modules: modules,

        start: function (path) {

            router.run(path);
        }
    }
    

}