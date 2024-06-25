define(['jquery', 'underscore', 'backbone', 'app',
        'collection/sensors',
        'collection/dashboard_sensors',
        'views/dashboard/QuickSensorItemView',
        'text!templates/dashboard/sensor.html',
        "i18n!:dashboard"
    ],
    function($, _, Backbone, app, SensorCollection, DashboardSensorCollection, QuickSensorItemView, QuickSensorTemplate, CommonStrings) {

        var view = Backbone.View.extend({

            template: template(QuickSensorTemplate),

            initialize: function() {
                this.collection = SensorCollection;
                //this.collection.bind("add reset remove change", this.loaded, this);
                this.collection.bind("loaded", this.loaded, this);
                this.dashboard_sensor_collection = DashboardSensorCollection;

                app.on("beforeLogout", this.clearTimer, this);
            },

            beforeRender: function() {

            },

            afterRender: function() {
                var context = this;
                //this.timer = setInterval(function() {
                //    context.collection.fetch();
                //}, 2500);
                this.$el.find("#sensor-dashboard").find('.box-body').html("");
                this.collection.reset();
                var criticalSensors = this.dashboard_sensor_collection.getCriticalSensors();

                criticalSensors.each(function(model) {
                    if (!app.readings) app.readings = {};

                    if (!app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')]) {
                        app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')] = [];
                    }
                    if(model.reading() != undefined){
                        var sensor_reading = model.reading();
                        sensor_reading = sensor_reading != Math.floor(sensor_reading) ? sensor_reading.toFixed(2) : Math.floor(sensor_reading);
                       app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].push({ reading: sensor_reading, time: (new Date().getTime()) });
                   }else{
                    app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].push({ reading: 0, time: (new Date().getTime()) });
                   }
                });

                this.collection.add(criticalSensors.models);

                this.loaded.call(this);
            },

            clearTimer: function() {
                clearInterval(this.timer);
            },

            loaded: function() {
                var criticalSensors = this.collection.getCriticalSensors();
                var sensorDashboard = this.$el.find("#sensor-dashboard");
                var context = this;

                if (criticalSensors.length) {
                    this.$el.find(".icon").removeClass("fa-check-circle");
                    this.$el.find(".icon").addClass("fa-warning");
                    if (sensorDashboard.hasClass("success")) {
                        sensorDashboard.find('.box-body').html("");
                    }
                    sensorDashboard.removeClass("box-success success");
                    sensorDashboard.addClass("box-danger");
                    sensorDashboard.find("h3 small").html(" - " + criticalSensors.length +" "+ CommonStrings.t("dashboard:critical_sensors"));
                    //sensorDashboard.find('.box-body').html("");
                    criticalSensors.each(function(model) {

                        if ($("#qsi_" + model.get('id')).length) {
                            if ($("#qsi_" + model.get('id')).parent().hasClass("box-body")) {
                                return;
                            } else if ($("#qsi_" + model.get('id')).parent().hasClass("recovered")) {
                                $("#qsi_" + model.get('id')).find(".knob-label-dark").addClass("knob-label").removeClass("knob-label-dark");
                                $("#qsi_" + model.get('id')).appendTo("#sensor-dashboard  .box-body");
                                $("#sensor-dashboard").find("h4 small").html(" (" + $("#sensor-recovercontent .row").length + " recovered)");
                            }
                            return;
                        }

                        context.insertView('.box-body', new QuickSensorItemView({
                            model: model
                        })).render();
                    });

                } else {
                    this.$el.find(".icon").removeClass("fa-warning");
                    this.$el.find(".icon").addClass("fa-check-circle");
                    sensorDashboard.removeClass("box-danger");
                    sensorDashboard.addClass("box-success success");
                    sensorDashboard.find("h3 small").html("");
                    sensorDashboard.find('.box-body').html('<div class="row">' +
                        '<div class="col-xs-12">' +
                        '<div class="knob-label text-center">'+CommonStrings.t("dashboard:allsensor_goodnow")+'</div>' +
                        '</div>' +
                        '</div>');

                }

                this.collection.each(function(model) {
                    if (model.isNormal()) {
                        //var sgv = this.getView(".qsi-graph");
                        //clearInterval(sgv.timer);
                        //this.remove();
                        //move it recently recovered list
                        /*this.$el.find(".knob-label").addClass("knob-label-dark").removeClass("knob-label");
                        this.$el.appendTo("#sensor-dashboard  .box-footer");
                        $("#sensor-dashboard").find("h4 small").html(" (" + $("#sensor-dashboard  .box-footer .row").length + " recovered)");*/

                        if ($("#qsi_" + model.get('id')).length) {
                            if ($("#qsi_" + model.get('id')).parent().hasClass("box-body")) {
                                $("#qsi_" + model.get('id')).find(".knob-label").addClass("knob-label-dark").removeClass("knob-label");
                                $("#qsi_" + model.get('id')).appendTo("#sensor-recovercontent");
                                $("#sensor-dashboard").find("h4 small").html(" (" + $("#sensor-recovercontent .row").length + " recovered)");
                                return;
                            } else if ($("#qsi_" + model.get('id')).parent().hasClass("recovered")) {
                                   
                                return
                            }
                            return;
                        }
                    }
                });

         
            if ($("#sensor-content").height() > 450 ){
              
                    
                    $("#sensor-content").slimscroll({
                    height: "450px",
                    width:"96%",
                    alwaysVisible: false,
                    size: "3px",
                    disableFadeOut :true
                });
                   
                }



                if ($("#sensor-recovercontent").height() > 250 ){
                  
                    $("#sensor-recovercontent").slimscroll({
                    height: "250px",
                    width:"96%",
                    alwaysVisible: false,
                    size: "3px"
                   
                });
                   
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
