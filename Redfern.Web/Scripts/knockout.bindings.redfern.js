$.redfern = {
    utils: {
        handleAttachments: function (textarea, result, observable, viewModel) {

            var height = 100, width = 100;
            var selection = $(textarea).data('selection') || $(textarea).focus().getSelection();

            height = (height == undefined) ? 0 : height;
            width = (width == undefined) ? 0 : width;

            var str = '';
            if (selection.text != '') {
                str = '[' + selection.text + ']';
            } else {
                str = '[' + result.data.fileName + ']';
            }
            if (result.data.contentType.split('/')[0] == 'image')
                str = '!' + str + '(/api/image/' + result.data.cardAttachmentId + ')';
            else
                str = str + '(/api/file/' + result.data.cardAttachmentId + ')';

            $(textarea).setSelection(selection.start, selection.end);
            $(textarea).replaceSelectedText(str);
            observable($(textarea).val());

            //
            viewModel.attachmentsList.attachments.splice(0, 0, new AttachmentListItem(result.data));
            viewModel.attachmentCount(viewModel.attachmentsList.attachments().length);
            $.boardcontext.current.hub.notify.onCardAttachmentAdded(viewModel.boardId(), result.data, result.activityContext);


        }
    }
}


function AttachDropZone(element, cardId, clickableElement) {
    $(element).dropzone({
        url: '/api/card/' + cardid + '/attachments/',
        method: 'post',
        previewsContainer: "#previews",
        clickable: clickableElement || false,
        dictResponseError: 'test error',
        init: function () {
            this.on('addedfile', function (file) {
                textarea.attr('disabled', 'disabled');
            })
            this.on('complete', function (file) {
                this.removeFile(file);
            })
            this.on('success', function (file, result) {
                textarea.removeAttr('disabled');
                textarea.focus();

                var height = 100, width = 100;
                var selection = $(textarea).data('selection') || $(textarea).focus().getSelection();

                height = (height == undefined) ? 0 : height;
                width = (width == undefined) ? 0 : width;

                var str = '';
                if (selection.text != '') {
                    str = '[' + selection.text + ']';
                } else {
                    str = '[' + result.data.fileName + ']';
                }
                if (result.data.contentType.split('/')[0] == 'image')
                    str = '!' + str + '(/api/image/' + result.data.cardAttachmentId + ')';
                else
                    str = str + '(/api/file/' + result.data.cardAttachmentId + ')';

                $(textarea).setSelection(selection.start, selection.end);
                $(textarea).replaceSelectedText(str);
                observable($(textarea).val());

                //
                viewModel.attachmentsList.attachments.splice(0, 0, new AttachmentListItem(result.data));
                viewModel.attachmentCount(viewModel.attachmentsList.attachments().length);
                $.boardcontext.current.hub.notify.onCardAttachmentAdded(viewModel.boardId(), result.data, result.activityContext);

            })
            this.on('drop', function (event) {
                var e = event;
            });
        },
    });
}

function MarkdownEditor(observable, viewModel) {
    var markdown = new MarkdownDeep.Markdown(),
        editorContainer = $('<div/>').addClass('markdown-editor').hide(),
        preview = $('<div/>').addClass('mdd_preview').hide(),
        toolbar = $('<div/>').addClass('mdd_toolbar'),
        textarea = $('<textarea/>').addClass('mdd_editor'),
        saveButton = $('<button/>').addClass('primary push-down-15').text('Save'),
        editButton = $('<button/>').addClass('push-down-15').text('Edit').hide(),
        previewButton = $('<button/>').addClass('push-down-15').text('Preview'),
        cancelButton = $('<button/>').addClass('link push-down-15').text('Cancel');

            
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
            SafeMode: false,
            ExtraMode:true,
            help_location: "/Content/mdd_help.html",
            disableTabHandling: true,
            disableAutoIndent: true,
            resizebar: false,
            cmd_img: function (ctx) {
                //alert('to be implemented');
            },
            cmd_link: function (ctx) {
                var selection = $(textarea).data('selection') || $(textarea).focus().getSelection();
                var str = '';
                if (selection.text != '') {
                    str = '<' + selection.text + '>';
                } 
                $(textarea).setSelection(selection.start, selection.end);
                $(textarea).replaceSelectedText(str);
            },
            onPreTransform: function (editor, markdown) {
                observable(markdown);
            }
        })
        .autosize();

    previewButton.click(function (event) {
        preview.html(markdown.Transform(observable()));
        textarea.fadeOut('slow', function () {
            preview.fadeIn();
            toolbar.hide();
            previewButton.hide();
            cancelButton.hide();
            editButton.show();
        });
    });

    editButton.click(function (event) {
        preview.fadeOut('slow', function () {
            toolbar.show();
            textarea.fadeIn().trigger('autosize.resize');
            previewButton.show();
            cancelButton.show();
            editButton.hide();
        });
    });

    // make the text area a dropzone
    var dropzone = new Dropzone($(textarea).get(0),{
        url: '/api/card/' + viewModel.cardId() + '/attachments/',
        method: 'post',
        previewsContainer: "#previews",
        clickable: $(toolbar).find('#mdd_img').get(0),
        dictResponseError: 'test error',
        init: function () {
            this.on('addedfile', function (file) {

            })
            this.on('complete', function (file) {
                this.removeFile(file);
            })
            this.on('success', function (file, result) {

                textarea.focus();

                var height = 100, width = 100;
                var selection = $(textarea).data('selection') || $(textarea).focus().getSelection();

                height = (height == undefined) ? 0 : height;
                width = (width == undefined) ? 0 : width;

                var str = '';
                if (selection.text != '') {
                    str = '[' + selection.text + ']';
                } else {
                    str = '[' + result.data.fileName + ']';
                }
                if (result.data.contentType.split('/')[0] == 'image')
                    str = '!' + str + '(/api/image/' + result.data.cardAttachmentId + ')';
                else
                    str = str + '(/api/file/' + result.data.cardAttachmentId + ')';

                $(textarea).setSelection(selection.start, selection.end);
                $(textarea).replaceSelectedText(str);
                observable($(textarea).val());

                //
                viewModel.attachmentsList.attachments.splice(0, 0, new AttachmentListItem(result.data));
                viewModel.attachmentCount(viewModel.attachmentsList.attachments().length);
                $.boardcontext.current.hub.notify.onCardAttachmentAdded(viewModel.boardId(), result.data, result.activityContext);

            })
            this.on('drop', function (event) {
                var e = event;
            });
        },
    });

    // assign current text selection to textarea so we canget access to it later
    $(textarea).click(function () {
        $(textarea).data('selection', $(this).getSelection());
    }).keyup(function () {
        $(textarea).data('selection', $(this).getSelection());
    })

    return {
        editor: editorContainer,
        textArea: textarea,
        button: {
            edit: editButton,
            save: saveButton,
            cancel: cancelButton
        },
        destroy: function () {
            dropzone.destroy();
            editorContainer.remove();
        }
    }

}

/**
 * add new card to column
 * 
 */
ko.bindingHandlers.addCard = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var column = $(element).parents('div.board-column'),
            bindings = allBindings();

        var observable = valueAccessor(),
            loader = $('<div/>').addClass('pinned double tile no-outline').attr('style', 'height:20px;text-align:center').append($('<img/>').attr('src','/content/images/ajax-loader-bar-1.gif')).hide(),
            container = $('<div/>').addClass('pinned double tile no-outline'),//.attr('style', 'min-height:50px;margin-top:10px;padding:10px'),
            div = $('<div/>').addClass('input-control textarea'),
            textarea = $('<textarea/>').attr('style', 'min-height:50px;max-height:50px').attr('maxlength', '100'),
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
        
		$(textarea).blur(function (event) {
		    if (preventBlurEvent) {
		        event.stopPropagation();
		        event.stopImmediatePropagation();
		        preventBlurEvent = false;
		    } else {
		        
		        cancel.click();
		    }
		})


	
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

/**
 * Dynamically adjust height of columns based on height of viewport
 * 
 */
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
                if (bindings.updateValue != null) {
                    bindings.updateValue(observable());
                }
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
 * Assign card to user
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
            /*
            select: function (event, ui) {
                observable(ui.item ? ui.item.id : "");
                if (assignCardOptions != null && assignCardOptions.displayValue != null) {
                    assignCardOptions.displayValue($(element).val());
                }
            },
            */
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
                    assignCardOptions.updateValue(observable());
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
                    if (bindings.tagitOptions.addTag != null) {
                        bindings.tagitOptions.addTag(tagValue);
                    }
                } else if (action == 'popped') {
                    observable.remove(tagValue);
                    if (bindings.tagitOptions.removeTag != null) {
                        bindings.tagitOptions.removeTag(tagValue);
                    }
                    
                }
            }
        }, bindings.tagitOptions);

        $(element).tagit(options);
       
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = ko.utils.unwrapObservable(valueAccessor());
        $(element).tagit('reset');
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
 * card wiki (description) editor
 * 
 */
ko.bindingHandlers.wikiEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor(),
            markdown = new MarkdownDeep.Markdown(),
            contentContainer = $('<div/>').addClass('markdown-content');

        var edit = function (event) {
            contentContainer.fadeOut(function () {
                var editorContainer = new MarkdownEditor(observable, viewModel);
                editorContainer.button.edit.click();
                editorContainer.editor.fadeIn(function () { });
                //textarea.trigger('autosize.resize');
                editorContainer.textArea.trigger('autosize.resize');
                editorContainer.button.save.click(function (event) {
                    observable(editorContainer.editor.find('textarea').val());
                    contentContainer.html(markdown.Transform(observable()));
                    enableEditing();
                    editorContainer.editor.fadeOut('slow', function () {
                        editorContainer.destroy();
                        contentContainer.fadeIn();
                    });
                    if (bindings.save != undefined)
                        bindings.save();
                });
                editorContainer.button.cancel.click(function () {
                    editorContainer.editor.fadeOut('slow', function () {
                        editorContainer.destroy();
                        contentContainer.fadeIn();
                    });
                });

                $(contentContainer).after(editorContainer.editor);
            });
            event.preventDefault();
        }

        // create the content
        var content = observable();
        if (content == null || content == '') {
            if (bindings.enable) {
                // create content to prompt user to enter a description
                content = $('<span/>').addClass('fg-grayLight fg-gray').append('<i class=""></i> Enter a description for this card...');
                content.click(edit);
            } else
                content = '';
        } else {
            content = markdown.Transform(content);
        }
        contentContainer.html(content);

        // create edit icon if enabled
        var enableEditing = function () {
            if (bindings.enable) {
                var pencilIcon = $('<div class="place-right controls" style="display:none"><a href=""><i class="icon-pencil fg-grayLight fg-hover-grayDark cursor-pointer"  ></i></a></div>');
                pencilIcon.find('a').click(edit);
                contentContainer.prepend(pencilIcon);
                // hover
                $(contentContainer).hover(
                    function () {
                        $(this).find('.controls').show();
                    },
                    function () {
                        $(this).find('.controls').hide();
                });
            }
        };
        enableEditing();

        
        $(element).after(contentContainer);

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            content = observable();
        //if (content != '')
        //    $(element).val(content);

    }
}

/**
 * new comment (description) editor
 * 
 */
ko.bindingHandlers.newCommentOnClick = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            observable = valueAccessor(),
            markdown = new MarkdownDeep.Markdown();
        
        function CreateNewEditor() {
            var editorContainer = new MarkdownEditor(observable, viewModel);

            editorContainer.button.save.click(function (event) {
                if (editorContainer.textArea.val().length > 0) {
                    observable(editorContainer.textArea.val());
                    editorContainer.editor.fadeOut('slow', function () {
                        editorContainer.destroy();
                        $(element).fadeIn();
                        editorContainer.textArea.val('');
                        if (bindings.save != undefined)
                            bindings.save();
                    });
                }
            });

            editorContainer.button.cancel.click(function () {
                editorContainer.editor.fadeOut('slow', function () {
                    editorContainer.destroy();
                    $(element).fadeIn();
                });
            })

            return editorContainer;

        }

        $(element).click(function () {
            
            $(element).fadeOut('slow', function () {
                var editorContainer = CreateNewEditor();
                $(element).after(editorContainer.editor);

                editorContainer.editor.fadeIn(function () {
                    editorContainer.textArea.focus();
                    editorContainer.textArea.trigger('autosize.resize');
                });
            });
            //editorContainer.textArea.focus();
            
            
        })

        
        // make the element a dropzone
        $(element).dropzone({
            url: '/api/card/' + viewModel.cardId() + '/attachments/',
            method: 'post',
            previewsContainer: "#previews",
            clickable: false,
            dictResponseError: 'test error',
            init: function () {
                this.on('addedfile', function (file) {

                })
                this.on('complete', function (file) {
                    this.removeFile(file);
                })
                this.on('success', function (file, result) {
                    var editorContainer = CreateNewEditor();
                    $(element).after(editorContainer.editor);
                    editorContainer.editor.fadeIn(function () {
                        editorContainer.textArea.focus();
                        editorContainer.textArea.trigger('autosize.resize');
                    });

                    $.redfern.utils.handleAttachments(editorContainer.textArea, result, observable, viewModel);
                })
                this.on('drop', function (event) {
                    var e = event;
                });
            },
        });

        
        

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            content = observable();
        //if (content != '')
        //    $(element).val(content);

    }
}


/**
 * comment editor
 * 
 */
ko.bindingHandlers.commentEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            card = bindings.card,
            editing = bindings.editing,
            observable = valueAccessor(),
            markdown = new MarkdownDeep.Markdown(),
            contentContainer = $('<div/>').addClass('markdown-content');


        // create the content
        var content = observable();
        content = markdown.Transform(content);
        contentContainer.html(content);

        editing.subscribe(function (newValue) {
            if (newValue) {
                var editorContainer = new MarkdownEditor(observable, card);

                editorContainer.button.save.click(function (event) {
                    if (editorContainer.textArea.val().length > 0) {
                        observable(editorContainer.textArea.val());
                        editorContainer.editor.fadeOut('slow', function () {
                            contentContainer.html(markdown.Transform(observable()));
                            contentContainer.fadeIn();
                            editorContainer.destroy();
                        });
                        editing(false);
                        if (bindings.save != undefined)
                            bindings.save(viewModel);
                    }
                });

                editorContainer.button.cancel.click(function () {
                    editorContainer.editor.fadeOut('slow', function () {
                        contentContainer.fadeIn();
                        editorContainer.destroy();
                    });
                   
                    editing(false);
                })

                $(contentContainer).after(editorContainer.editor);

                contentContainer.fadeOut('slow', function () {
                    editorContainer.editor.fadeIn(function () {
                        editorContainer.textArea.val(observable());
                        editorContainer.textArea.focus();
                        editorContainer.textArea.trigger('autosize.resize');
                    });
                });
            }
        })

        $(element).after(contentContainer);

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            content = observable();
        //if (content != '')
        //    $(element).val(content);

    }
}




/**
 * column properties 
 * 
 */
ko.bindingHandlers.columnProperties = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            formElementId = ko.utils.unwrapObservable(valueAccessor()),
            observable = valueAccessor(),
            column = $(element).parents('div.board-column'),
            form = $('#' + formElementId);

        $(element).on('click', function () {
            var cloned = $(form).clone();
            $(cloned).removeAttr('id').insertBefore($('.board-column-wrapper', column));
            $('.revert', cloned).click(function () {
                cloned.slideUp('slow', function () {
                    cloned.remove();
                    $('.board-column-wrapper', column).show();
                });
                $('.board-column-wrapper', column).show('slow', function () { });
            });
            $('.board-column-wrapper', column).slideToggle();
            $(cloned).slideDown('slow', function () {
                ko.applyBindings(viewModel, $(cloned).get(0));
                $('input', cloned).focus();
            });
        })
        
    }
}


/**
 * custom bindinghandler to select a user from a jquery selectmenu widget
 * 
 */
ko.bindingHandlers.userSelectMenu = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            options = bindings.users,
            value = valueAccessor();

        
        $.widget("custom.userselectmenu", $.ui.selectmenu, {
            _renderItem: function (ul, item) {
                var li = $("<li>", { text: item.label });

                if (item.disabled) {
                    li.addClass("ui-state-disabled");
                }

                $("<img>", {
                    style: item.element.attr("data-style"),
                    src: '/api/avatar/' + item.value +'?height=25'
                }).prependTo(li);

                return li.appendTo(ul);
            }
        });
        

        var optionStr;
        $.each(options, function (index, item) {
            optionStr += '<option>' + item.label + '</option>'

            $(element).append($('<option/>', { value: item.id, text: item.label }));
            //$(element).append($('<option/>').attr('value', item.id).text(item.label));
            //$('<option>Patrick</option>').appendTo($(element));
        })
        //$(element).html(optionStr);
        $(element).userselectmenu();
   
    }
}

/**
 * bindinghandler to add a new card task
 * 
 */
ko.bindingHandlers.taskInput_deprecated = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            options = bindings.users,
            value = valueAccessor(),
            container = $('<div />', { 'class': '' }),
            inputControl = $('<div />', { 'class': 'input-control text' }),
            input = $('<input />', { 'type' :  'text' }),
            addButton = $('<button/>', { 'class': 'primary', text:'Add'}),
            cancelLink = $('<button/>', { 'class': 'link', text: 'Done' });


        var preventBlurEvent;
        addButton.mousedown(function () {
            preventBlurEvent = true;
        }).click(function () {
            var save = ko.utils.unwrapObservable(value),
                data = {
                    description: input.val(),
                    assignedToUser: bindingContext.$data.assignedToUser() || null,
                    assignedDate: moment(new Date()).utc().toJSON(),
                    dueDate:''
                };
            preventDefault = true;
            save(data);
            input.val('');
        })

        cancelLink.click(function (event) {
            $(element).show();
            container.hide();
        })

        input.blur(function (event) {
            if (preventBlurEvent) {
                preventBlurEvent = false;
                event.preventDefault();
            } else {
                cancelLink.click();
            }
        })


        $(element).click(function (event) {
            container.append(inputControl.append(input)).append(addButton).append(cancelLink);
            $(this).before(container.show());
            input.focus();
            $(this).hide();
            event.preventDefault();
        });

    }
}

/**
 * bindinghandler to add a new card task
 * 
 */
ko.bindingHandlers.taskInput = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            options = bindings.users,
            value = valueAccessor(),
            inputControlCheckbox = $('<div/>', { 'class': 'input-control checkbox', style:'width:100%'}),
            label = $('<label/>'),
            checkbox = $('<input/>', {type:'checkbox', disabled: 'disabled'}),
            spanCheckbox = $('<span/>', { 'class': 'check inline-block', style: 'vertical-align:top;margin-top:2px;' }),
            spanInput = $('<input />', { type:'text', 'class': 'inline-block', style: 'border:0;width:80%' , placeholder:'Add task...'});

        function saveValue() {
            if (spanInput.val() != null && spanInput.val().length > 0) {
                var save = ko.utils.unwrapObservable(value),
                data = {
                    description: spanInput.val(),
                    assignedToUser: bindingContext.$data.assignedToUser() || null,
                    assignedDate: moment(new Date()).utc().toJSON(),
                    dueDate: ''
                };
                preventDefault = true;
                save(data);
                spanInput.val(null);
            }
        }

        spanInput.blur(function () {
            saveValue();
        }).keyup(function (event) {
            if (event.which == 13) saveValue();
        })

        inputControlCheckbox.append(label.append(checkbox).append(spanCheckbox).append(spanInput));
        $(element).append(inputControlCheckbox);

    }
}


/**
 * bindinghandler to edit a card task
 * 
 */
ko.bindingHandlers.taskEdit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var bindings = allBindings(),
            task = valueAccessor(),
            inputControlCheckbox = $('<div/>', { 'class': 'input-control checkbox', style:'width:100%'}),
            label = $('<label/>'),
            checkbox = $('<input/>', {type:'checkbox'}),
            spanCheckbox = $('<span/>', { 'class': 'check inline-block', style: 'vertical-align:top;margin-top:2px;' }),
            spanInput = $('<input />', { type:'text', 'class': 'inline-block', style: 'border:0;width:80%' });

        var descriptionChanged = false;
        function saveDescription() {
            if (spanInput.val() != null && spanInput.val().length > 0 && descriptionChanged) {
                task.description(spanInput.val());
                bindingContext.$parent.taskList.update(task);        
            } else {
                
            }
            descriptionChanged = false;
        }

        
        // output task item
        inputControlCheckbox.append(label.append(checkbox).append(spanCheckbox).append(spanInput.val(task.description())));
        $(element).append(inputControlCheckbox);
       
        
        // handle events
        spanInput.change(function () {
            descriptionChanged = true;
        }).blur(function (event) {
            saveDescription();
        }).keyup(function (event) {
           if (event.keyCode == 8 || event.keyCode == 46) {
                if (spanInput.val() == null || spanInput.val().length == 0) {
                    bindingContext.$parent.taskList.remove(task);
                    
                }
            }
            else if (event.which == 13) {
                saveDescription();
            }
        })

        checkbox.click(function () {
            if ($(this).prop('checked')) {
                bindingContext.$parent.taskList.complete(task).done(function (result) {
                    //spanInput.css({ 'text-decoration': 'line-through' });
                    //spanInput.prop('disabled', 'disabled');
                });
            } else {
                bindingContext.$parent.taskList.uncomplete(task).done(function (result) {
                    //spanInput.css({ 'text-decoration': '' });
                    //spanInput.prop('disabled', '');
                })
            }

        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var checkbox = $(element).find('input[type=checkbox]'),
            spanInput = $(element).find('input[type=text]'),
            task = valueAccessor();

        if (task.completedDate() != null) {
            checkbox.prop('checked', 'checked');
            spanInput.css({ 'text-decoration': 'line-through' });
            spanInput.prop('disabled', 'disabled');
            
        } else {
            checkbox.prop('checked', '');
            spanInput.css({ 'text-decoration': '' });
            spanInput.prop('disabled', '');
        }

        spanInput.val(task.description());
        

    }
}

/**
 * bindinghandler to show a card label if label has been changed from the default value
 * 
 */
ko.bindingHandlers.cardLabelDisplay = {
    
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            defaultCardNames = ['Amber', 'Yellow','Red','Blue','Magenta','Cobalt','Emerald','Mauve'];

        ko.bindingHandlers.html.update(element, function () {
            if ($.inArray(observable(), defaultCardNames) == -1)
                return '<span class="label">' + observable() + '</span>';
            else
                return '';
        });

    }
}

