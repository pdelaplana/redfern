ko.bindingHandlers.hiddenInputValue = {

	init: function (element, valueAccessor) {

		$(element).bind("change", function (event, data, formatted) { //hidden vars don't usually have change events, so we trigger $myElement.trigger("change");
			var value = valueAccessor();
			value($(this).val()); //rather than $(this).val(), might be best to pass our custom info in data
		});
	},
	update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor();
		$(element).val(value);
	}

};


ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || 
            {  };
        $(element).datepicker(options);

        var funcOnSelectdate = function () {
            var observable = valueAccessor();
            //var observable = ko.utils.unwrapObservable(valueAccessor());
            if (observable != null) {
                
                var current = $(element).datepicker("getDate");
                if (current != null)
                    observable(current);
                else
                    observable(null);
            }
        }
        options.onSelect = funcOnSelectdate;
        ko.utils.registerEventHandler(element, 'change', funcOnSelectdate);

        //handle the field changing
        /*
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            var current = $(element).datepicker("getDate");
            //var current = $(element).val();
            alert(current);
            observable(new Date(current));
        });
        */

        funcOnSelectdate();

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        //handle date data coming via json from Microsoft
        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }

        /*
        var current = $(element).datepicker("getDate");
        if (value - current !== 0) {
            $(element).datepicker("setDate", current);
            return;
        } 
        */
        $(element).datepicker("setDate", value);
    }
};

ko.bindingHandlers.timepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        
        var funcOnSelectTime = function () {
            var observable = valueAccessor();
            var date = observable();
            //var observable = ko.utils.unwrapObservable(valueAccessor());
            var current = $(element).val();
            date.setHours(current.substring(0, 2), current.substring(2, 4));
            observable(date);
        }
        //options.onSelect = funcOnSelectdate;
        ko.utils.registerEventHandler(element, 'change', funcOnSelectTime);

        //handle the field changing
        /*
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            var current = $(element).datepicker("getDate");
            //var current = $(element).val();
            alert(current);
            observable(new Date(current));
        });
        */

        funcOnSelectTime();

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //$(element).datepicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        //value is a date time
        var value = ko.utils.unwrapObservable(valueAccessor());
        //handle date data coming via json from Microsoft
        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }

        // extract hours and minutes
        var time = moment(value).format('hhmm');

        /*
        var current = $(element).datepicker("getDate");
        if (value - current !== 0) {
            $(element).datepicker("setDate", current);
            return;
        } 
        */
        $(element).val(time);
    }
}


ko.bindingHandlers.autocomplete = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings();
        var settings = bindings.settings;
        var observable = valueAccessor();
        $(element).autocomplete({
            source: settings.source,
            select: function (event, ui) {
                observable(ui.item ? ui.item.id : 0);
            },
            change: function (event, ui) {
                observable(ui.item ? ui.item.id : 0);
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings();
        var settings = bindings.settings;
        var observable = valueAccessor();
        $(element).val(observable());
    }
};

ko.bindingHandlers.uploadButton = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var bindings = allBindingsAccessor();
        var settings = bindings.settings;
        var inputFile = $('<input/>').attr('type', 'file').insertAfter($(element)).hide();
        inputFile.change(function () {
            var file = this.files[0];
            if (ko.isObservable(valueAccessor())) {
                valueAccessor()(file);
            }
            settings.upload();
        });
        $(element).click(function () {
            inputFile.click();
        })
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var file = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindingsAccessor();
        var settings = bindings.settings;
        if (settings.fileObjectURL && ko.isObservable(settings.fileObjectURL)) {
            var oldUrl = settings.fileObjectURL();
            if (oldUrl) {
                windowURL.revokeObjectURL(oldUrl);
            }
            settings.fileObjectURL(file && windowURL.createObjectURL(file));
        }

        if (settings.fileBinaryData && ko.isObservable(settings.fileBinaryData)) {
            if (!file) {
                settings.fileBinaryData(null);
            } else {
                settings.fileName(file.name);
                settings.fileType(file.type);

                var reader = new FileReader();
                reader.onload = function (e) {
                    settings.fileBinaryData(e.target.result);

                    /*
                    var result = e.target.result || {};
                    var resultParts = result.split(',');
                    if (resultParts.length === 2) {
                        bindings.fileBinaryData(resultParts[1]);
                        //bindings.fileType(resultParts[0]);

                    }
                    */

                };
                reader.readAsArrayBuffer(file);
                //reader.readAsText(file);
                //reader.readAsDataURL(file);
            }
        }
    }

}

ko.bindingHandlers.file = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var bindings = allBindingsAccessor();
        var settings = bindings.settings;
        $(element).change(function () {
            var file = this.files[0];
            if (ko.isObservable(valueAccessor())) {
                valueAccessor()(file);
            }
            settings.upload();
        });
    },

    update: function (element, valueAccessor, allBindingsAccessor) {
        var file = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindingsAccessor();
        var settings = bindings.settings;
        if (settings.fileObjectURL && ko.isObservable(settings.fileObjectURL)) {
            var oldUrl = settings.fileObjectURL();
            if (oldUrl) {
                windowURL.revokeObjectURL(oldUrl);
            }
            settings.fileObjectURL(file && windowURL.createObjectURL(file));
        }

        if (settings.fileBinaryData && ko.isObservable(settings.fileBinaryData)) {
            if (!file) {
                settings.fileBinaryData(null);
            } else {
                settings.fileName(file.name);
                settings.fileType(file.type);

                var reader = new FileReader();
                reader.onload = function (e) {
                    settings.fileBinaryData(e.target.result);
                    
                    /*
                    var result = e.target.result || {};
                    var resultParts = result.split(',');
                    if (resultParts.length === 2) {
                        bindings.fileBinaryData(resultParts[1]);
                        //bindings.fileType(resultParts[0]);

                    }
                    */

                };
                reader.readAsArrayBuffer(file);
                //reader.readAsText(file);
                //reader.readAsDataURL(file);
            }
        }
    }
};

ko.bindingHandlers.timeago = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var date = value();
        if (date != null) {
            var strDate = moment(date).fromNow();
            $(element).text(strDate);
        } else {
            $(element).text('');
        }
    }
};

ko.bindingHandlers.clientAutocomplete = {
    init: function (element, params) {
        $(element).autocomplete(params());
    }
}


ko.bindingHandlers.inlineEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var originalText = '',
            bindings = allBindings(),
            observable = valueAccessor(),
            fontSize = (bindings.fontSize != undefined) ? bindings.fontSize : "23pt",
            div = $('<div/>').addClass('input-control text').attr('style', 'margin:0;padding:0;height:100%;line-height:23pt;vertical-align:top'),
            input = $('<input/>').attr('type', 'text').attr('style', 'width:100%;font-size:'+fontSize+';line-height:'+fontSize+';vertical-align:top'),
            btn = $('<button class="btn-save"></button>').attr('style', 'font-size:'+fontSize);

        var onSave = function () {
            var deferred = $.Deferred();
            bindings.save(viewModel);
            deferred.resolve();
            return deferred.promise();
        }

        var preventBlurEvent;
        btn.mousedown(function () {
            preventBlurEvent = true;
        }).click(function (event) {
            observable($(input).val());
            onSave(viewModel).done(function () {
                $(element).text(originalText);
                $(div).hide();
                $(element).show();
                observable('');
            });
            event.stopPropagation();
        });
        div.append(input).append(btn).hide();
        $(element).after(div);

        $(element).on('click', function () {
            originalText = $(this).text();
            $(div).show();
            //$(input).val().focus();
            $(input).val(observable()).focus();
            $(this).hide();
            return false;
        });

        $(input).blur(function (event) {
            if (preventBlurEvent) {
                preventBlurEvent = false;
            }
            else {
                $(div).hide();
                $(element).show();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
            
        })

    }
};


