define(['jquery', 'underscore', 'backbone','app',
    'models/app_config', // api/status/uptime
    'models/user_config', // api/settings/user-preference
    //'views/dashboard/QuickButtonViewPC',
    //'views/dashboard/QuickButtonViewHVM',
    'views.dashboard/QuickButtonView3',
    'views/dashboard/SystemStatusView',
    'views/dashboard/ProductInformationView',
    'views/dashboard/NetworkInformationView',
    'views/dashboard/FirmwareInformationView',
    //'collection/scripts',
    'text!templates/dashboard/stats.html',
    'i18n!:stats'
],
function($, _, Backbone, app ,AppConfigModel, UserConfigModel, 
    //QuickButtonViewPC, QuickButtonViewHVM, 
    QuickButtonView3, SystemStatusView, ProductInformationView, NetworkInformationView, FirmwareInformationView, StatsTemplate, CommonStrings) {

    var view = Backbone.View.extend({

        template: template(StatsTemplate),

        initialize: function() {
            this.acm = AppConfigModel;

            this.ucm = UserConfigModel;
            this.ucm.bind("change:tasks", this.updateTasks, this);
        },

        afterRender: function() {
            var that = this;
            AppConfigModel.fetch({
                success: function(){
                    that.updateUptime.call(that, AppConfigModel); 
                }
            });

            this.acm.trigger("change", this.acm, this.acm.get('minutes_per_count'));
            
            var quickbutton = new QuickButtonView3()
            this.inserView("#quick-button", quickbutton).render();
            /*var quickbutton1 = new QuickButtonViewPC();
            this.insertView("#pc-button", quickbutton1).render();

            var quickbutton2 = new QuickButtonViewHVM();
            this.insertView("#hvm-button", quickbutton2).render();
            */
            var stat = new SystemStatusView();
            this.insertView("#system-status-info", stat).render();

            var product = new ProductInformationView();
            this.insertView("#product-information-info", product).render();

            var network = new NetworkInformationView();
            this.insertView("#network-info", network).render();

            var firmware = new FirmwareInformationView();
            this.insertView("#firmware-information-info", firmware).render();
        },

        updateUptime: function(model) {
            var minutesCount = model.attributes.minutes_per_count;
            var readingCount = model.attributes.poh_counter_reading;
            var hours = ((minutesCount*readingCount)/60)%24;
            var days = Math.floor((minutesCount*readingCount/60)/24);
            if(isNaN(hours) && isNaN(days)) {
                hours = 0; days = 0
            }
            this.$("#uptime").html(days+ " d "+hours).next().html(hours==1?"hr":"hrs");
        },
        script_more_info: function(ev) {
            ev.preventDefault();                
            if(app.configurations.isFeatureAvailable("AUTOMATION")) {                  
              var url = '#scripts';                  
              window.location.assign(url);
            }
            else{                    
                alert(CommonStrings.t("stats:automation_engine_is_not_enabled"));
            }
        },
        updateTasks: function(model, value) {                
            if (model.get('tasks')) {
                this.$("#user-activity-count").html(model.get('tasks').length);                
            } 
            else {
                this.$("#user-activity-count").html("0");                
            }
        },
        serialize: function() {                
            return {
                locale: CommonStrings                
            };
        }
    });

    return view;
});