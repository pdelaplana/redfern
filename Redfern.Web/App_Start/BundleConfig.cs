using System.Web;
using System.Web.Optimization;

namespace Redfern.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/scripts/jquery-ui-{version}.js",
                        "~/scripts/jquery.datepicker.localization.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
                        "~/Scripts/jquery.helpers.js",
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/jquery.blockui.js",
                        "~/Scripts/jquery.tagit.js",
                        "~/Scripts/jquery.fileinput.js",
                        "~/Scripts/moment.js",
                        "~/Scripts/moment-with-lang.js",
                        "~/scripts/jquery.tabslideout.js",
                        "~/scripts/markdowndeeplib.min.js",
                        "~/scripts/dropzone/dropzone.js",
                        "~/scripts/jquery.autosize.js",
                        "~/scripts/popModal.js",
                        "~/scripts/jquery.colorbox.js",
                        "~/scripts/rangyinputs-jquery-1.1.2.js"
                        ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/scripts/bootstrap.js",
                        "~/scripts/respond.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/signalr").Include(
                        "~/Scripts/jquery.signalR-{version}.js",
                        "~/Scripts/hubs/boardhubclient.js"
                        ));


            //bundles.Add(new ScriptBundle("~/bundles/metro").IncludeDirectory(
            //          "~/scripts/metro-ui/js", "*.js"));

            bundles.Add(new ScriptBundle("~/bundles/metro").Include(
                        "~/scripts/metro-ui/js/metro-global.js",
                        "~/scripts/metro-ui/js/metro-core.js",
                        "~/scripts/metro-ui/js/metro-locale.js",
                        "~/scripts/metro-ui/js/metro-accordion.js",
                        "~/scripts/metro-ui/js/metro-button-set.js",
                        "~/scripts/metro-ui/js/metro-calendar.js",
                        "~/scripts/metro-ui/js/metro-carousel.js",
                        "~/scripts/metro-ui/js/metro-countdown.js",
                        "~/scripts/metro-ui/js/metro-date-format.js",
                        "~/scripts/metro-ui/js/metro-datepicker.js",
                        "~/scripts/metro-ui/js/metro-dialog-custom.js",
                        "~/scripts/metro-ui/js/metro-drag-tile.js",
                        "~/scripts/metro-ui/js/metro-dropdown.js",
                        "~/scripts/metro-ui/js/metro-fluentmenu.js",
                        "~/scripts/metro-ui/js/metro-hint.js",
                        "~/scripts/metro-ui/js/metro-initiator.js",
                        "~/scripts/metro-ui/js/metro-input-control.js",
                        "~/scripts/metro-ui/js/metro-listview.js",
                        "~/scripts/metro-ui/js/metro-live-tile.js",
                        //"~/scripts/metro-ui/js/metro-loader.js",
                        "~/scripts/metro-ui/js/metro-notify-custom.js",
                        "~/scripts/metro-ui/js/metro-panel.js",
                        "~/scripts/metro-ui/js/metro-plugin-template.js",
                        "~/scripts/metro-ui/js/metro-progressbar.js",
                        "~/scripts/metro-ui/js/metro-pull.js",
                        "~/scripts/metro-ui/js/metro-rating.js",
                        "~/scripts/metro-ui/js/metro-scroll.js",
                        "~/scripts/metro-ui/js/metro-slider.js",
                        "~/scripts/metro-ui/js/metro-stepper.js",
                        "~/scripts/metro-ui/js/metro-streamer.js",
                        "~/scripts/metro-ui/js/metro-tab-control.js",
                        "~/scripts/metro-ui/js/metro-table.js",
                        "~/scripts/metro-ui/js/metro-tile-transform.js",
                        "~/scripts/metro-ui/js/metro-times.js",
                        "~/scripts/metro-ui/js/metro-touch-handler.js",
                        "~/scripts/metro-ui/js/metro-treeview.js",
                        "~/scripts/metro-ui/js/metro-wizard.js"
                      ));


            bundles.Add(new ScriptBundle("~/bundles/prettify").Include(
                        "~/scripts/google-code-prettify/prettify.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                        "~/scripts/knockout-{version}.js",
                        "~/scripts/knockout.mapping-latest.js",
                        "~/scripts/knockout.functions.js",
                        "~/scripts/knockout.bindings.js",
                        "~/scripts/knockout.bindings.markdowndeep.js",
                        "~/scripts/knockout.bindings.sortable.js",
                        "~/scripts/knockout.bindings.redfern.js",
                        "~/scripts/knockout.bindings.editortile.js"));

            bundles.Add(new ScriptBundle("~/bundles/sammy").Include(
                        "~/scripts/sammy-{version}.js"));


            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/scripts/app/router.js",
                        "~/scripts/app/ui.js",
                        "~/scripts/app/app.js",
                        "~/scripts/common.js",
                        "~/scripts/main.js"
                        ));


            bundles.Add(new ScriptBundle("~/bundles/modules").Include(
                        "~/scripts/repositories/tagrepository.js",
                        "~/scripts/repositories/boardrepository.js",
                        "~/scripts/repositories/cardrepository.js",
                        "~/scripts/repositories/cardtagrepository.js",
                        "~/scripts/repositories/cardcommentrepository.js",
                        "~/scripts/repositories/boardcolumnrepository.js",
                        "~/scripts/repositories/boardmemberrepository.js",
                        "~/scripts/repositories/userprofilerepository.js",
                        "~/scripts/repositories/useravatarrepository.js",
                        "~/scripts/repositories/cardactivityrepository.js",
                        "~/scripts/repositories/cardtyperepository.js",
                        "~/scripts/repositories/cardattachmentrepository.js",
                        "~/scripts/repositories/userrepository.js",
                        "~/scripts/repositories/boardactivityrepository.js",
                        "~/scripts/widgets/appnavigationbar.js",
                        "~/scripts/widgets/createboarddialog.js",
                        "~/scripts/widgets/cardpropertiesdialog.js",
                        "~/scripts/widgets/errordialog.js",
                        "~/scripts/widgets/createboardtile.js",
                        "~/scripts/views/boards.js",
                        "~/scripts/views/boardsidebar.js",
                        "~/scripts/views/boardui.js",
                        "~/scripts/views/board.js",
                        "~/scripts/views/profile.js",
                        "~/scripts/views/changepassword.js",
                        "~/scripts/views/users.js"
                        ));



            //
            // style bundles
            //
            bundles.Add(new StyleBundle("~/content/css").Include(
                      "~/content/metro-ui/css/metro-bootstrap.css",
                      "~/content/metro-ui/css/metro-bootstrap-responsive.css",
                      "~/content/metro-custom.css",
                      "~/content/themes/metro/jquery-ui.css",
                      "~/content/nanoscroller.css",
                      "~/content/tagit-stylish-yellow.css",
                      "~/content/fileinput.css",
                      "~/content/mdd_styles.css",
                      "~/scripts/dropzone/css/basic.css",
                      "~/scripts/dropzone/css/dropzone.css",
                      "~/content/colorbox.css",
                      "~/content/popModal.css",
                      "~/content/site.css"));
        }
    }
}
