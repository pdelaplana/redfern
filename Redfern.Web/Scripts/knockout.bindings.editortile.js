ko.bindingHandlers.editortile = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var bindings = allBindings();

		var observable = valueAccessor(),
            div = $('<div/>').addClass('input-control text').attr('style', 'margin:0;padding:0;vertical-align:top'),
            input = $('<input/>').attr('type', 'text').attr('style', 'width:100%;vertical-align:top'),
            btn = $('<button class="btn-save"></button>'),
            heading = $('<h3>').text('Create Board');

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
            onSave().done(function () {
				$(element).text(observable());
				$(div).hide();
				$(element).show();
			});
			event.stopPropagation();
		});
		div.append(input).append(btn);//.hide();

		var currentContent = $(element).find('.tile-content');
		var swapContent = $('<div class="tile-content"></div>').html( $('<div class="padding10"></div>').html(div)).hide().insertAfter('.tile-content');
	
		$(element).on('click', function () {

		    $(currentContent).hide();
			$(swapContent).show();
			$(input).focus();
		    return false;
		});

		$(input).blur(function (event) {
			if (preventBlurEvent) {
				preventBlurEvent = false;
			}
			else {
				$(swapContent).hide();
				$(currentContent).show();
				event.stopPropagation();
				event.stopImmediatePropagation();
			}

		})

	}
};


