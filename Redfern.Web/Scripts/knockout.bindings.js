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
        var bindings = allBindingsAccessor(),
            options = allBindingsAccessor().datepickerOptions ||
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

                if (bindings.saveValue != undefined)
                    bindings.saveValue(observable());

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

        //funcOnSelectdate();

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });

        //handle date data coming via json from Microsoft
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }
        $(element).datepicker("setDate", value);

        // allow  
        $(element).next('.btn-date').click(function () {
            $(element).datepicker('show');
        })

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
        //$(element).datepicker("setDate", value);
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
            minLength: 0,
            select: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
            },
            focus: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
            },

            change: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
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

        $(input)
            .blur(function (event) {
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
            .keyup(function (event) {
                if (event.keyCode == 13) {
                    $(btn).trigger('click');
                }

            })

    }
};


ko.bindingHandlers.autosize = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var enable = ko.utils.unwrapObservable(valueAccessor()),
            id = $(element).attr('id') ? $(element).attr('id') : 'none';
        if (enable)
            $(element).autosize({ id :id, append:'' });
    }
};

ko.bindingHandlers.popModal = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            value = ko.utils.unwrapObservable(valueAccessor()),
            enabled = bindings.enabled || true,
            options = $.extend({
                html: '',
                placement: 'bottomLeft',
                showCloseBut: true,
                onDocumentClickClose: false,
                onOkBut: function () { },
                onCancelBut: function () { },
                onLoad: function () { },
                onClose: function () {
                    $(element).removeClass('popModalOpen');
                }
            }, bindings.popModalOptions);
        
        if (enabled) {
            $(element).click(function (event) {
                if ($(this).hasClass('popModalOpen')) {
                    $(this).removeClass('popModalOpen');
                    $(this).popModal('hide');

                } else {
                    $(this).popModal(options);

                    ko.applyBindings(bindingContext.$data, $(element).next('.popModal').get(0));
                    $(this).addClass('popModalOpen');

                }
                event.preventDefault();
                event.stopPropagation();
            })
        }
        
    }
};

ko.bindingHandlers.popModalCalendar = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            enable = ko.utils.unwrapObservable(valueAccessor()),
            observable = valueAccessor(),
            options = $.extend({
                html: '<div class="popModal_calendar"></div><div class="padding10 nbp"><a href="" class="button">Clear</a></div>',
                //html: div.get(0),
                placement: 'bottomLeft',
                showCloseBut: true,
                onDocumentClickClose: true,
                onOkBut: function () { },
                onCancelBut: function () { },
                onLoad: function (event) {

                    var calendar = $('.popModal_calendar').datepicker();
                    var clearBtn = $(calendar).next('div').find('.button');
                    
                    var funcOnClear = function (event) {
                        observable(null);
                        if (bindings.saveValue != null)
                            bindings.saveValue(observable());
                        event.preventDefault();
                    };

                    var funcOnSelectdate = function () {

                        if (observable != null) {

                            var current = $(calendar).datepicker("getDate");
                            if (current != null)
                                observable(current);
                            else
                                observable(null);

                            if (bindings.saveValue != null)
                                bindings.saveValue(observable());

                        }
                    }
                    //options.onSelect = funcOnSelectdate;
                    ko.utils.registerEventHandler(calendar, 'change', funcOnSelectdate);
                    ko.utils.registerEventHandler(clearBtn, 'click', funcOnClear);
                    
                },
                onClose: function () {
                    $(element).removeClass('popModalOpen');
                }
            }, bindings.popModalOptions);

        
        $(element).click(function (event) {
            if ($(this).hasClass('popModalOpen')) {
                $(this).removeClass('popModalOpen');
                $(this).popModal('hide');

            } else {
                $(this).popModal(options);

                
                $(this).addClass('popModalOpen');

            }
            event.preventDefault();
            event.stopPropagation();

        })

    }
};

ko.bindingHandlers.colorbox = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable= valueAccessor();

        //$(document).delegate(element, "click", function (e) {
        $(element).click(function(e){
            $.colorbox({ photo: true, href: bindings.href, opacity:1, width:'95%', height:'95%' });
            return false;
        });
    }
};


ko.bindingHandlers.truncatedText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var originalText = ko.utils.unwrapObservable(valueAccessor()),
            // 10 is a default maximum length
            length = ko.utils.unwrapObservable(allBindingsAccessor().maxTextLength) || 20,
            truncatedText = originalText.length >= length ? originalText.substring(0, length-4) + "..." : originalText;
        // updating text binding handler to show truncatedText
        ko.bindingHandlers.text.update(element, function () {
            return truncatedText;
        });
    }
};



/**
 * timeago 
 * 
 */
ko.bindingHandlers.timeago = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor();

        function updateTimeAgo() {
            $(element).text(moment.utc(ko.utils.unwrapObservable(observable())).fromNow())
        }

        setInterval(updateTimeAgo, 1000);

        $(element).attr('title', ko.utils.unwrapObservable(observable()));
        updateTimeAgo();

    }
}

/*
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
*/

/**
 * droppable 
 * 
 */
ko.bindingHandlers.droppable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor();

        $(element).droppable({
            accept: bindings.accept,
            activeClass: "ui-state-hover",
            hoverClass: 'ol-red',
            drop: function (event, ui) {
                alert('dropped');

            }
        });

    }
}

/**
 * hover 
 * 
 */
ko.bindingHandlers.hover = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            value = valueAccessor();

        $(this).find(ko.utils.unwrapObservable(value)).hide();

        $(element).hover(
            function () {
                $(this).find(ko.utils.unwrapObservable(value)).show();
            },
            function () {
                $(this).find(ko.utils.unwrapObservable(value)).hide();
            });

    }
}

/**
 * Metro UI Dropdown
 * 
 */
ko.bindingHandlers.dropdown = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            value = valueAccessor(),
            dropdownMenu = $(element).next('.dropdown-menu');

        // enable dropdown
        dropdownMenu.dropdown();

        // handle click event on dropdown options
        dropdownMenu.find('li>a').click(function (event) {
            value($(this).text());
            if (bindings.prefix != null)
                $(element).text(bindings.prefix + ' ' + value());
            else
                $(element).text(value());
            event.preventDefault();
        })

    }
}

