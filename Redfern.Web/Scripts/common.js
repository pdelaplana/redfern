// 
// string extensions
//
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
if (!String.prototype.stripHtml) {
    String.prototype.stripHtml = function () {
        return this.replace(/(<([^>]+)>)/ig, "")
    };
}
if (!String.prototype.truncate) {
    String.prototype.truncate = function (maxLength) {
        var originalString = this;
        maxLength = maxLength || 500;
        return originalString >= maxLength ? originalString.substring(0, maxLength - 4) + "..." : originalString;
    };
}

//
// moment extensions
//
if (!Date.prototype.toLocalDate) {
    Date.prototype.toLocalDate = function (formatStr) {
        if (formatStr == undefined) formatStr = 'll';
        return moment(moment.utc(this).toDate()).format(formatStr)
    };
}

if (!String.prototype.toLocalDate) {
    String.prototype.toLocalDate = function (formatStr) {
        if (formatStr == undefined) formatStr = 'll';
        return moment(moment.utc(new Date(this)).toDate()).format(formatStr)
    };
}


