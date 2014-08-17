// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

//
// moment extensions
//
if (!Date.prototype.toLocalDate) {
    Date.prototype.toLocalDate = function () {
        return moment(moment.utc(this).toDate()).format('ll')
    };
}

if (!String.prototype.toLocalDate) {
    String.prototype.toLocalDate = function () {
        return moment(moment.utc(new Date(this)).toDate()).format('ll')
    };
}


