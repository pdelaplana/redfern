ko.bindingHandlers.cardCreator = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var column = $(element).parents('div.board-column'),
            bindings = allBindings();

        var observable = valueAccessor(),
            container = $('<div/>').addClass('pinned double tile no-outline'),//.attr('style', 'min-height:50px;margin-top:10px;padding:10px'),
            div = $('<div/>').addClass('input-control textarea'),
            textarea = $('<textarea/>').attr('style', 'min-height:50px'),
            add = $('<button class="primary">Add</button>').attr('style', 'margin-top:10px'),
            cancel = $('<button class="link">Cancel</button>').attr('style', 'margin-top:10px');

        var onAdd = function () {
            var deferred = $.Deferred();
            bindings.create(viewModel, $('.board-column-content', column));
            deferred.resolve();
            return deferred.promise();
        }

        var preventBlurEvent;
        add.mousedown(function () {
            preventBlurEvent = true;
        }).click(function (event) {
            observable($(textarea).val());
            onAdd().done(function () {
                $(textarea).val('').focus();
                //$(container).detach();
            });
            event.stopPropagation();
        });

        cancel.click(function () {
            container.detach();
        });

		
		$(element).on('click', function () {
		    $('.board-column-content', column).append(container);

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

