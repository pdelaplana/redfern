ko.bindingHandlers.markdown = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        
                    
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
           markdown = new MarkdownDeep.Markdown(),
           content = observable();

        if (content == null || content == '') {
            content = '';
        }
        content = markdown.Transform(content);
        $(element).html(content);
    }

}

ko.bindingHandlers.markdownEditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor();
        
        $(element).val(observable()).MarkdownDeep({
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
        });

        //$(element).autosize();

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var observable = valueAccessor(),
            content = observable();
        //if (content != '')
        //    $(element).val(content);

    }

}



