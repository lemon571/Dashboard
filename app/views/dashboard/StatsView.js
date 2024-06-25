define(['jquery', 'underscore', 'backbone','app',
        'models/app_config', // api/status/uptime
        'models/user_config', // api/settings/user-preference
        'views/dashboard/SystemStatusView',
        //'collection/scripts',
        'text!templates/dashboard/stats.html',
        'i18n!:stats'
    ],
    function($, _, Backbone, app ,AppConfigModel, UserConfigModel, SystemStatusView, StatsTemplate, CommonStrings) {

        var view = Backbone.View.extend({

            template: template(StatsTemplate),

            initialize: function() {
                this.acm = AppConfigModel;
               // this.acm.bind("change", this.updateUptime, this);

                this.ucm = UserConfigModel;
                this.ucm.bind("change:tasks", this.updateTasks, this);
                //this.scripts_collection=ScriptsCollection;
            },
            events: {
                 //"click #script_more_info": "script_more_info"
            },

            beforeRender: function() {
                var that = this;
               /* $.getJSON("https://www.megarac.com/store/spx/ae/update.php?callback=?", "last_script_id=0", function(res) {
                    that.$("#new-ae-scripts-count").html(res.count);
                });*/
             
            },

            afterRender: function() {
                //this.scripts_collection= new ScriptsCollection();
                var that = this;
                AppConfigModel.fetch({
                    success: function(){
                        that.updateUptime.call(that, AppConfigModel); 
                        //this has been commented due to dashboard loading performance issues.                                               
                        /*if(app.configurations.isFeatureAvailable("AUTOMATION")){
                            that.updateAutomationScripts.call(that);
                        }*/
                    }
                });

                $.ajax({
                    url : "/api/logs/audit",
                    type : "GET",
                    dataType : "json",
                    data : {
                        // set cmd as 1 to get audit count only
                        "cmd" : 1,
                    },
                    contentType : "application/json",
                    success : function(data, status, xhr) {
                        that.updateAuditLog.call(that, data.audit_count);
                    }
                });

                //this.updatePendingDeassertions.call(this);

                this.acm.trigger("change", this.acm, this.acm.get('minutes_per_count'));
                //this.ucm.trigger("change:tasks", this.ucm, this.ucm.get('tasks'));

                var stat = new SystemStatusView();
                console.log("Insert view system-status-info")
                this.insertView("#system-status-info", stat).render();
            },
            /*events: {
                 "click #script_more_info": "script_more_info"
            },*/

            beforeRender: function() {
                var that = this;
               /* $.getJSON("https://www.megarac.com/store/spx/ae/update.php?callback=?", "last_script_id=0", function(res) {
                    that.$("#new-ae-scripts-count").html(res.count);
                });*/
            },

            updateAutomationScripts:function(){                                
                var that=this;                
                 //if(app.isFeatureEnabled("AUTOMATION")) {  
                    this.scripts_collection.fetch({
                        success: function(){                           
                           that.$("#new-ae-scripts-count").html(that.scripts_collection.models.length);
                        }
                    });
                    //will be taken care later
                    /*$.ajax({
                      url: "https://www.megarac.com/store/spx/ae/update.php?callback=?",
                      dataType: 'json',
                      global:false,
                      data: "last_script_id=0",
                      success: function(res) {
                          that.$("#new-ae-scripts-count").html(res.count);
                      },
                      error : function(){
                        }
                    });*/
                //}
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
                }else{
                    alert(CommonStrings.t("stats:automation_engine_is_not_enabled"));
                }
            },

            updateTasks: function(model, value) {
                if (model.get('tasks')) {
                    this.$("#user-activity-count").html(model.get('tasks').length);
                } else {
                    this.$("#user-activity-count").html("0");
                }
            },
            updatePendingDeassertions:function() {
                /*var context = this;
                $.ajax({
                    type: "GET",
                    url: "/api/logs/pending-Deassertions",
                    success: function(response, status, xhr) {
                    	context.$("#asserted-events-count").html(response.pending_deassert);
                    }
                });*/
            },

            updateAuditLog: function(count) {
                this.$("#new-audit-issues-count").html(count);
            },

            serialize: function() {
                return {
                    locale: CommonStrings
                };
            }

        });

        return view;

    });
