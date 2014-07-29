ko.observableArray.fn.filterByProperty = function (propertyName, matchValue) {
    return ko.computed(function () {
        var allItems = this(), matchingItems = [];
        for (var i = 0; i < allItems.length; i++) {
            var current = allItems[i];
            if (ko.unwrap(current[propertyName]) === matchValue)
                matchingItems.push(current);
        }
        return matchingItems;
    }, this);
}

ko.observableArray.fn.findByProperty = function (propertyName, matchValue) {
    return ko.utils.arrayFirst(this(), function (item) {
        return ko.unwrap(item[propertyName]) === matchValue;
    })
}

ko.observableArray.fn.getArrayOfProperty = function (propertyName) {
    return ko.utils.arrayMap(this(), function (item) {
        return ko.unwrap(item[propertyName]);
    })

}

ko.observableArray.fn.insert = function (item, index) {
    //this.splice(this().length - 1, 0, item);
    this.splice(index, 0, item);
}