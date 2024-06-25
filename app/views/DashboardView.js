define(
    ["jquery", "underscore", "backbone", "app",
        "models/datetime/dashboard_ntp",
        'collection/dashboard_sensors',
        "views/dashboard/StatsView",
        "views/dashboard/LogDetailsView",
        "views/dashboard/QuickSensorView",
        //"views/dashboard/CalendarView",
        //template
        'text!templates/dashboard.html',
        //localize
        'i18n!:dashboard',
        'moment',
        //plugins
        //"knob", 
        "raphael", "morris", "todo","fullcalendar"
        // , "bower/bootstrap/js/bootstrap-tab"
        // , "bower/bootstrap/js/bootstrap-dropdown"
        // , "jvectormap"
    ],
    function($, _, Backbone, app, DateTimeModel, DashboardSensorCollection, StatsView, LogDetailsView, QuickSensorView,DashTemplate, CommonStrings,moment) {
        var view = Backbone.View.extend({

            //keep: true,

            template: template(DashTemplate),

            initialize: function() {
                this.on("close", this.close, this);
                this.datetimemodel = DateTimeModel;
            },

            beforeRender: function () {
                
                var that = this;
                
                this.views = [];

                var stat = new StatsView();
                this.views.push(stat);
                this.insertView(".top", stat);
                if(window.sessionStorage.getItem("BMC_Timezone") == null){
                    this.datetimemodel.fetch({
                        success: function() {
                            window.sessionStorage.setItem("BMC_Timezone", that.datetimemodel.get("timezone"));
                            window.sessionStorage.setItem("BMC_Timezone_offset", that.datetimemodel.get("utc_minutes"));
                            window.localStorage.setItem("BMC_Timezone", that.datetimemodel.get("timezone"));
                            window.localStorage.setItem("BMC_Timezone_offset", that.datetimemodel.get("utc_minutes"));
                        }
                    });
                }

                if(app.DASHBOARD_WIDGET){
                    if(app.ischecked){
                        //load the log and sensor views
                        that.getDashboardData();
                    }else{
                        // Disabled mode throws the return
                        return false;
                    }
                }else{
                    // load all the dashboard content feature not available
                    that.getDashboardData();
                }
                
            },
            afterRender: function(){
                
            },

            renderCalendar: function() {
            },

            getDashboardData: function() {
                var context = this;
                var log = new LogDetailsView(),
                    sensor = new QuickSensorView();

                this.views.push(log);
                this.views.push(sensor);
                DashboardSensorCollection.reset();
                DashboardSensorCollection.fetch({
                    complete: function(){
                        context.insertView(".left", log).render();
                        context.insertView(".right", sensor).render();
                        app.featureFilter();
                    }
                });
            },

            serialize: function() {
                return {
                    locale: CommonStrings
                };
            },

            close: function() {
                var context = this;
                _.each(this.views, function(View){
                    View.trigger('close');
                    context.removeView(View);
                });
            }

        });

        return view;
    });
