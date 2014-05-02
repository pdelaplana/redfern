ko.bindingHandlers.markdown = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        
                    
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
           markdown = new MarkdownDeep.Markdown(),
           content = observable();

        if (content == null || content == '') {
            content = 'You can use this area to enter additional details for the card.  ' +
                        'Click the Edit link to add new content.  ';
        }
        content = markdown.Transform(content);
        $(element).html(content);
    }

}

ko.bindingHandlers.markdownEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor();
        
        $(element).MarkdownDeep({
            help_location: "/Content/mdd_help.html",
            disableTabHandling: true,
            resizebar: false,
            cmd_img: function (ctx) {
                alert('to be implemeted');
            },
            cmd_link: function (ctx) {
                alert('to be implemeted');
            },
            onPreTransform: function (editor, markdown) {
                observable(markdown);
            }
        });

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            content = observable();
        //if (content != '')
        //    $(element).val(content);

    }

}

