ko.bindingHandlers.addCard = {
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
            if ($(textarea).val().length > 0) {
                observable($(textarea).val());
                loader.show();
                $(textarea).val('')
                onAdd().done(function () {
                    $(textarea).focus();
                    loader.hide();
                    //$(container).detach();
                });
            }
            $(textarea).focus();
            
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
            if (bindings.enable) {
                $(this).siblings('.tile').removeClass('selected');
                $(this).addClass('selected');
                observable(bindings.color());
            }
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

/**
 * Lookup user with jquery ui autocomplete
 * 
 */
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

/**
 * Lookup user with jquery ui autocomplete
 * 
 */
ko.bindingHandlers.tagit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor();

        var options = $.extend({
            initialTags: null,
            triggerKeys: ['enter', 'tab'],
            enabled: true,
            tagSource: function (request, response) {
                $.ajax({
                    url: '/api/tag/',
                    type: 'GET',
                    dataType: 'json',
                    data: { name: request.term, boardId: bindingContext.$data.boardId() },
                    success: function (data) {
                        response($.map(data, function (name, val) {
                            return { label: name, value: name, id: val }
                        }))
                    }
                })
            },
            tagsChanged: function (tagValue, action, element) {
                if (action == 'added') {
                    observable.push(tagValue);
                } else if (action == 'popped') {
                    observable.remove(tagValue);
                }
            }
        }, bindings.tagitOptions);

        $(element).tagit(options);
       
    }
}

/**
 * card title editor
 * 
 */
ko.bindingHandlers.cardTitleEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor(),
            text = $('<span/>').text(observable()),
            input = $('<textarea/>').autosize();
            
        $(input).hide();
        
        $(element).addClass('card-title-editor cursor-pointer').append(text).append(input);

        $(text).on('click', function () {
            if (bindings.enable) {
                $(input).val(observable()).show().focus().trigger('autosize.resize');
                $(text).hide();
            }
            return false;
        });

        $(input)
            //.blur(function (event) {
            //    observable($(input).val());
            //    $(input).hide();
            //    $(text).show();
            //    event.stopPropagation();
            //    event.stopImmediatePropagation();
            //})
            .keyup(function (event) {
                if (event.keyCode == 13) {
                    $(this).blur();
                }

            })

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            text = $(element).find('span'),
            input = $(element).find('input[type=text]');

        $(text).text(observable());

    }
};

/**
 * card wiki editor
 * 
 */
ko.bindingHandlers.wikiEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor(),
            markdown = new MarkdownDeep.Markdown(),
            contentContainer = $('<div/>').addClass('markdown-content bd-hover-grayDarker ' + (bindings.enable ? 'cursor-pointer' : '')),
            editorContainer = $('<div/>').addClass('markdown-editor').hide(),
            preview = $('<div/>').addClass('mdd_preview').hide(),
            toolbar = $('<div/>').addClass('mdd_toolbar'),
            textarea = $('<textarea/>').addClass('mdd_editor'),
            saveButton = $('<button/>').addClass('primary push-down-10').text('Save'),
            editButton = $('<button/>').addClass('push-down-10').text('Edit').hide(),
            previewButton = $('<button/>').addClass('push-down-10').text('Preview'),
            cancelButton = $('<button/>').addClass('link push-down-10').text('Cancel');

        // create the content
        var content = observable();
        if (content == null || content == '') {
            if (bindings.enable)
                // create content to prompt user to enter a description
                content = $('<span/>').addClass('fg-grayLight fg-gray fg-hover-grayDarker cursor-pointer').append('<i class="icon-plus-2"></i> Add a description...');
            else
                content = '';
        } else {
            content = markdown.Transform(content);
        }
        contentContainer.html(content);

        // allow the user to click on content to edit
        contentContainer.click(function (event) {
            if (bindings.enable) {
                contentContainer.fadeOut(function () {
                    editButton.click();
                    editorContainer.fadeIn(function () {
                        textarea.trigger('autosize.resize');
                    });

                });
                
            }
            event.preventDefault();
        })

        // create the editor , with markdown and autosize

        editorContainer
            .append(preview)
            .append(toolbar)
            .append(textarea)
            .append(saveButton).append('&nbsp;')
            .append(editButton).append('&nbsp;')
            .append(previewButton).append('&nbsp;')
            .append(cancelButton);

        $(textarea)
            .val(observable())
            .MarkdownDeep({
                help_location: "/Content/mdd_help.html",
                disableTabHandling: true,
                disableAutoIndent: true,
                resizebar: false,
                cmd_img: function (ctx) {
                    alert('to be implemented');
                },
                cmd_link: function (ctx) {
                    alert('to be implemented');
                },
                onPreTransform: function (editor, markdown) {
                    observable(markdown);
                }
            })
            .autosize();

        saveButton.click(function (event) {
            observable(textarea.val());
            contentContainer.html(markdown.Transform(observable()));
            editorContainer.fadeOut('slow', function () {
                contentContainer.fadeIn();
            });
            if (bindings.save != undefined)
                bindings.save();
        });

        previewButton.click(function (event) {
            preview.html(markdown.Transform(observable()));
            textarea.fadeOut('slow', function () {
                preview.fadeIn();
                toolbar.hide();
                previewButton.hide();
                editButton.show();
            });
        });

        editButton.click(function (event) {
            preview.fadeOut('slow', function () {
                toolbar.show();
                textarea.fadeIn().trigger('autosize.resize');
                previewButton.show();
                editButton.hide();
            });
        });

        cancelButton.click(function () {
            editorContainer.fadeOut('slow', function () {
                contentContainer.fadeIn();
            });
        })




        $(element).after(contentContainer).after(editorContainer);

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            content = observable();
        //if (content != '')
        //    $(element).val(content);

    }

}



