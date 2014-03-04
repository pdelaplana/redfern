function Application(applicationContainer) {

    function ModulesArray() {
        this.add = function (name, module) {
            this[name] = module;
        }
    }
    ModulesArray.prototype = [];
    
    var router = new Router(applicationContainer),
        modules = new ModulesArray()

    return {

        router: router,
    
        modules: modules,

        start: function (path) {

            router.run(path);
        }
    }
    

}