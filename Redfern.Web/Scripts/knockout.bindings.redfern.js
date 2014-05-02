ko.bindingHandlers.cardCreator = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var column = $(element).parents('div.board-column'),
            bindings = allBindings();

        var observable = valueAccessor(),
            loader = $('<div/>').addClass('pinned double tile no-outline').attr('style', 'height:20px;text-align:center').append($('<img/>').attr('src','/content/images/ajax-loader-bar-1.gif')).hide(),
            container = $('<div/>').addClass('pinned double tile no-outline'),//.attr('style', 'min-height:50px;margin-top:10px;padding:10px'),
            div = $('<div/>').addClass('input-control textarea'),
            textarea = $('<textarea/>').attr('style', 'min-height:50px').attr('maxlength', '100'),
            add = $('<button class="primary">Add</button>').attr('style', 'margin-top:10px'),
            cancel = $('<button class="link">Cancel</button>').attr('style', 'margin-top:10px');

        var onAdd = function () {
            //var deferred = $.Deferred();
            return bindings.create(viewModel, $('.board-column-content', column));
            //deferred.resolve();
            //return deferred.promise();
        }

        var preventBlurEvent;
        add.mousedown(function () {
            preventBlurEvent = true;
        }).click(function (event) {
            observable($(textarea).val());
            loader.show();
            $(textarea).val('')
            onAdd().done(function () {
                $(textarea).focus();
                loader.hide();
                //$(container).detach();
            });
            event.stopPropagation();
        });

        cancel.click(function () {
            loader.detach();
            container.detach();
        });

		
		$(element).on('click', function () {
		    $('.board-column-content', column).append(loader).append(container);
		    loader.hide();
		    container.show();
		    $(textarea).focus();

		    var height = $('.board-column-content', column)[0].scrollHeight;
		    $('.board-column-content', column).scrollTop(height);

		    return false;
		});


		div.append(textarea).append(add).append(cancel);//.hide();
		container.append(div);

		$(element).attr('style', 'cursor:pointer');
        /*
		$(textarea).blur(function (event) {
			if (preventBlurEvent) {
				preventBlurEvent = false;
			}
			else {
			    container.detach();
				event.stopPropagation();
				event.stopImmediatePropagation();
			}

		})
        */
	}
};

ko.bindingHandlers.editColumn = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var column = $(element).parents('div.board-column'),
            form = $('#ColumnEditForm'),
            observable = valueAccessor(),
            bindings = allBindings();

        $(element).click(function (event) {

            var cloned = $(form).clone(),
                save = $('[data-role=save-btn]', cloned),
                name = $('input', cloned);
            
            $(cloned).removeAttr('id').insertBefore($('.board-column-wrapper', column));
            
            $('.board-column-wrapper', column).slideToggle();
            $(cloned).slideDown('slow', function () {
                $('input', cloned).val(observable()).focus();
            });

            $('.revert', cloned).click(function () {
                cloned.slideUp('slow', function () {
                    cloned.remove();
                    $('.board-column-wrapper', column).show();
                });
                
                $('.board-column-wrapper', column).show('slow', function () {});
            });

            $(save).click(function () {
                viewModel.name(name.val());
                $('.revert', cloned).click();
            });
        });

    }
};


ko.bindingHandlers.maximizeColumn = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).width($(window).width()-120);
        $(window).resize(function () {
            $(element).width($(window).width() - 120);
        });
    }
}

ko.bindingHandlers.adjustBoardWidth = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var observable = valueAccessor();
        var boardWidth = (observable.settings.columnCount * observable.settings.columnWidth) + 410;
        $(element).width(boardWidth);

    }
}

ko.bindingHandlers.adjustColumnHeight = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var columnHeight = valueAccessor(),
            column = element;

        $(column).height(columnHeight()-140);
        $('.board-column-content', column).height(columnHeight() - 210);

        $(window).resize(function () {
            columnHeight($(window).height());
            $(column).height(columnHeight() - 140);
            $('.board-column-content', column).height(columnHeight() - 210);

        })
        
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        
    }
}

/**
 * Set card color based on observable value
 * 
 */
ko.bindingHandlers.setTileColor = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var color = valueAccessor(),
            bindings = allBindingsAccessor(),
            isArchived = bindings.archived,
            colorClass = isArchived ? 'bg-gray' : 'bg-'+color();
        
        $(element)
            .removeClass(function (index, css) {
                return (css.match(/\bbg-\S+/g) || []).join(' ');
            })
            .addClass(colorClass);
    }
}

/**
 * Change card color based on observable value
 * 
 */
ko.bindingHandlers.changeTileColor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var observable = valueAccessor(),
            bindings = allBindingsAccessor();
        $(element).click(function () {
            $(this).siblings('.tile').removeClass('selected');
            $(this).addClass('selected');
            observable(bindings.color());
        })
        
    }
}

/**
 * Lookup user with jquery ui autocomplete
 * 
 */
ko.bindingHandlers.userLookup = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            settings = bindings.settings,
            observable = valueAccessor();
        
        $(element).autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: '/api/user/',
                    type: 'GET',
                    dataType: 'json',
                    data: { name: request.term },
                    success: function (data) {
                        response($.map(data, function (name, val) {
                            return { label: name, value: name, id: val }
                        }))
                    }
                })
            },
            minLength: 0,
            select: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (settings != null && settings.displayValue != null) {
                    settings.displayValue($(element).val());
                }
            },
            focus: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (settings != null && settings.displayValue != null) {
                    settings.displayValue($(element).val());
                }
            },
            change: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (settings != null && settings.displayValue != null) {
                    settings.displayValue($(element).val());
                }
            }
        })
        .data('ui-autocomplete')._renderItem = function (ul, item) {
            return $('<li>')
                .append('<a><img src="/api/avatar/'+item.id+'?height=25" /> ' + item.label + '</a>')
                .appendTo(ul);
        };

    }
}


ko.bindingHandlers.assignCard = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            assignCardOptions = bindings.assignCardOptions,
            observable = valueAccessor();

        if (assignCardOptions != null && assignCardOptions.displayValue != null) {
            if (assignCardOptions.displayValue() != 'Unknown User')
                $(element).val(assignCardOptions.displayValue());
        }
        var members = assignCardOptions.members ? assignCardOptions.members : [];
        members.splice(0, 0, { label: '-', value: '', id: '' });

        $(element).autocomplete({
            source: members,
            minLength: 0,
            select: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (assignCardOptions != null && assignCardOptions.displayValue != null) {
                    assignCardOptions.displayValue($(element).val());
                }
            },
            /*
            focus: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (assignCardOptions != null && assignCardOptions.displayValue != null) {
                    assignCardOptions.displayValue($(element).val());
                }
            },
            */
            change: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (assignCardOptions != null && assignCardOptions.displayValue != null) {
                    assignCardOptions.displayValue($(element).val());
                }
            }
        })
        .data('ui-autocomplete')._renderItem = function (ul, item) {
            if (item.id.length > 0){
                return $('<li>')
                    .append('<a><img src="/api/avatar/' + item.id + '?height=25" /> ' + item.label + '</a>')
                    .appendTo(ul);
            } else {
                return $('<li>')
                    .append('<a><img src="/content/images/grey-box.png" style="height:25px" /> '+ item.label +'</a>')
                    .appendTo(ul);
            }
        };
        var button = $('<button class="btn-dropdown" />')
            .click(function () {
                if ($(element).autocomplete("widget").is(":visible"))
                    $(element).autocomplete('close');
                else {
                    $(element).autocomplete('search', '');
                    $(element).focus();
                }
            })
        $(element).after(button);

        


    }
}

