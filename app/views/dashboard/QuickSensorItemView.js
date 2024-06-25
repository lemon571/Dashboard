define(['jquery', 'underscore', 'backbone', 'app',
        'collection/event-log',
        'text!templates/dashboard/sensor-item.html',
        "i18n!:dashboard",
        "moment",
        'chartjs'
    ],
    function($, _, Backbone, app, EventLogCollection, QuickSensorItemTemplate, CommonStrings, moment, chartjs) {

        var view = Backbone.View.extend({

            template: template(QuickSensorItemTemplate),

            initialize: function() {
                this.model.bind("change:reading", this.updateReading, this);
            },

            events: {
                "click": "showDetails"
            },

            beforeRender: function() {
                this.$el.addClass("row qsi");
            },

            afterRender: function() {
                this.$el.attr("id", "qsi_" + this.model.get('id'));

                this.$el.find(".qsi-name").html(this.model.name());
                //this.$el.find(".qsi-reading").html(this.model.reading() + " " + this.model.unit());

                // this.setView(".qsi-graph", new SensorGraphView({
                //     model: this.model,
                //     graphSettings: {
                //         lineColor: (this.model.isCritical() ? '#00C0EF' : 'purple'),
                //         fillColor: 'rgba(255,255,255,.2)',
                //         width: '100%'
                //     }
                // })).render();

                this.updateReading.call(this, this.model, this.model.get('reading'));

                var sensor_icon= this.getIcon(this.model.sensorType().toString());

                this.$(".sensor_icon").addClass(sensor_icon);
                this.drawchart();
                
            },

            showDetails: function(){
                app.router.navigate("sensors/"+this.model.get('owner_lun')+"/"+this.model.get('sensor_number'), {trigger: true});
            },
            drawchart: function(){
                var line_chart;
                var context = this;
                this.timer = setInterval(function() {
                    //context.readings.push(context.currentReading);
                    var sensor_readings = [];
                    var reading_to_check = app.readings['sensor_'+context.model.get('sensor_number')+'_' + context.model.get('owner_lun')];
                    if(reading_to_check != undefined) {
                        sensor_readings = _.pluck(app.readings['sensor_' + context.model.get('sensor_number')+'_' + context.model.get('owner_lun')], 'reading');
                    }
                    if (sensor_readings.length > context.maxGraphPoints) {
                        sensor_readings = sensor_readings.slice(sensor_readings.length - context.maxGraphPoints, sensor_readings.length);
                    }
                    
                var data = {
                    labels: sensor_readings,
                    datasets: [{
                        data: sensor_readings,
                        fill:true,
                    }]
                };

                var options = {
                    responsive: true,
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 10,
                            bottom: 10
                        }
                    },
                    animation: {
                        duration: 0
                    },
                    legend: {
                        display: false,
                    },
                    plugins: {
                        datalabels: {
                            display: false,
                        },
                    },
                    scales: {
                        yAxes: [
                          {
                            display: false
                          }
                        ],
                        xAxes: [
                          {
                            display: false
                          }
                        ]
                      },
                    tooltips: {
                        bodyFontSize: 24,
                        displayColors: false,
                        callbacks: {
                        title: function(tooltipItems, data) {
                            return '';
                          },
                          label: function(tooltipItem, data) {
                            return tooltipItem.yLabel +' '+ context.model.unit();
                          }
                        },
                        mode: 'index',
                        intersect: false,
                        // yAlign: 'left',
                        animationDuration: 0
                     },
                     hover: {
                         mode: "none",
                        intersect: false,
                        animationDuration: 0
                     },
                     responsiveAnimationDuration: 0,
                     elements: {
                        line: {
                            borderColor: '#707070',
                            borderWidth: 2
                          },
                        point:{
                            radius: 0
                        }
                    }
                }
                if(line_chart)               
                {
                        line_chart.destroy();
                }

                var ctx = context.$("#sensor_chart")
                line_chart = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: options
                });
            }, 1000);
            },
            getIcon: function(type) {
                var sensor_icons = {
                    "temperature": "ion-thermometer",
                    "voltage": "ion-ios-pulse-strong",
                    "current": "ion-ios-bolt",
                    "fan": "ion-nuclear",
                    "chassis_intrusion": "fa fa-server",
                    "physical_security":"fa fa-server",
                    "platform_security_violation": "ion-unlocked",
                    "platform_security": "ion-unlocked",
                    "processor": "ion-code-working",
                    "power_supply": "ion-outlet",
                    "power_unit": "ion-power",
                    "cooling_device": "ion-ios-snowy",
                    "other_units": "ion-information-circled",
                    "other_units_based_sensor": "ion-information-circled",
                    "memory": "ion-information-circled",
                    "drive_slot": "fa fa-hdd-o",
                    "post_memory_resize": "ion-ios-settings-strong",
                    "system_firmware_error": "fa fa-warning",
                    "event_logging_disabled": "ion-ios-paper",
                    "watchdog": "ion-eye",
                    "watchdog_2": "ion-eye",
                    "watchdog_1": "ion-eye",
                    "system_event": "ion-flag",
                    "critical_interrupt": "ion-close-circled",
                    "button": "ion-toggle-filled",
                    "board": "ion-information-circled",
                    "microcontroller": "ion-information-circled",
                    "add_in_card": "fa fa-plus",
                    "chassis": "fa fa-server",
                    "chipset": "ion-information-circled",
                    "chip_set": "ion-information-circled",
                    "other_fru": "ion-information-circled",
                    "cable": "ion-information-circled",
                    "cable_or_interconnect": "ion-information-circled",
                    "terminator": "fa fa-minus-circle",
                    "system_boot": "fa fa-terminal",
                    "system_boot_or_restart_initiated": "fa fa-terminal",
                    "boot_error": "fa fa-times-circle",
                    "base_os_boot": "fa fa-terminal",
                    "os_boot": "fa fa-terminal",
                    "os_shutdown": "ion-power",
                    "slot": "fa fa-navicon",
                    "system_acpi": "ion-power",
                    "platform_alert": "fa fa-bell",
                    "entity_presence": "fa fa-check-circle",
                    "monitor_asic": "ion-ios-search-strong",
                    "monitor_asic_or_ic": "ion-ios-search-strong",
                    "lan": "fa fa-sitemap",
                    "management_subsystem_health": "fa fa-medkit",
                    "battery": "ion-battery-half",
                    "session_audit": "fa fa-user",
                    "version_change": "ion-information-circled",
                    "fru_state": "ion-help-circled",
                    "oem_reserved": ""
                };
                return sensor_icons[type] || "fa fa-dashboard";
            },

            updateReading: function(model, value) {
                var reading = model.reading();
                reading = reading != Math.floor(reading) ? reading.toFixed(2) : Math.floor(reading);
                this.$el.find(".qsi-reading").html(reading + " " + model.unit());

                var context = this;

                var bmctz = window.sessionStorage.getItem("BMC_Timezone");
                // "moment" to convert utc-offset failed if timezone is "GMT+x" or "GMT-x".
                // So convert it to "Etc/GMT...
                if (bmctz == "GMT+1") bmctz = "Etc/GMT-1";
                else if (bmctz == "GMT+2") bmctz = "Etc/GMT-2";
                else if (bmctz == "GMT+3") bmctz = "Etc/GMT-3";
                else if (bmctz == "GMT+4") bmctz = "Etc/GMT-4";
                else if (bmctz == "GMT+5") bmctz = "Etc/GMT-5";
                else if (bmctz == "GMT+6") bmctz = "Etc/GMT-6";
                else if (bmctz == "GMT+7") bmctz = "Etc/GMT-7";
                else if (bmctz == "GMT+8") bmctz = "Etc/GMT-8";
                else if (bmctz == "GMT+9") bmctz = "Etc/GMT-9";
                else if (bmctz == "GMT+10") bmctz = "Etc/GMT-10";
                else if (bmctz == "GMT+11") bmctz = "Etc/GMT-11";
                else if (bmctz == "GMT+12") bmctz = "Etc/GMT-12";
                else if (bmctz == "GMT+13") bmctz = "Etc/GMT-13";

                else if (bmctz == "GMT-1") bmctz = "Etc/GMT+1";
                else if (bmctz == "GMT-2") bmctz = "Etc/GMT+2";
                else if (bmctz == "GMT-3") bmctz = "Etc/GMT+3";
                else if (bmctz == "GMT-4") bmctz = "Etc/GMT+4";
                else if (bmctz == "GMT-5") bmctz = "Etc/GMT+5";
                else if (bmctz == "GMT-6") bmctz = "Etc/GMT+6";
                else if (bmctz == "GMT-7") bmctz = "Etc/GMT+7";
                else if (bmctz == "GMT-8") bmctz = "Etc/GMT+8";
                else if (bmctz == "GMT-9") bmctz = "Etc/GMT+9";
                else if (bmctz == "GMT-10") bmctz = "Etc/GMT+10";
                else if (bmctz == "GMT-11") bmctz = "Etc/GMT+11";
                else if (bmctz == "GMT-12") bmctz = "Etc/GMT+12";
                else if (bmctz == "GMT-13") bmctz = "Etc/GMT+13";
                else if (bmctz == "GMT-14") bmctz = "Etc/GMT+14";

                /*if(EventLogCollection.length == 0){
                 
                    EventLogCollection.fetch({
                                data: $.param({
                            LASTEVENTID:0
                        }),
                        success: function(collection, resp, options) {
                            var lastEvent = EventLogCollection.find(function(eventModel){
                               return (eventModel.get('sensor_number') == model.get('sensor_number') && eventModel.get('ipmb_lun') == model.get('owner_lun') );
                            });
                            if(lastEvent) {
                                var client_frmNow=moment((lastEvent.get('timestamp')*1000)+(moment.tz(bmctz)._offset*60*1000)).fromNow();
                                //context.$el.find(".qsi-time").html(lastEvent.description() + " for " + moment(lastEvent.get('timestamp'), 'X').fromNow(true));
                                context.$el.find(".qsi-time").html(lastEvent.description() + " for " + client_frmNow);
                            }
                        }
                    });

                }else{          
                    var lastEvent = EventLogCollection.find(function(eventModel){
                        return (eventModel.get('sensor_number') == model.get('sensor_number') && eventModel.get('ipmb_lun') == model.get('owner_lun'));
                    });
                    if(lastEvent) {
                        var client_frmNow=moment((lastEvent.get('timestamp')*1000)+(moment.tz(bmctz)._offset*60*1000)).fromNow();
                        //context.$el.find(".qsi-time").html(lastEvent.description() + " for " + moment(lastEvent.get('timestamp'), 'X').fromNow(true));
                        context.$el.find(".qsi-time").html(lastEvent.description() + " for " + client_frmNow);
                    }
                }*/
                


               
/*
                app.db.from('ipmi_events').where('sensor_number', '=', model.get('sensor_number'))
                    .order('timestamp').reverse()
                    .list()
                    .done(function(results) {
                        if (results.length) {
                            context.$el.find(".qsi-time").html(results[0].event_description + " for " + moment(results[0].timestamp).fromNow(true));
                        }
                    });
*/
                if (model.isNormal()) {
                    //var sgv = this.getView(".qsi-graph");
                    //clearInterval(sgv.timer);
                    //this.remove();
                    //move it recently recovered list
                    this.$el.find(".knob-label").addClass("knob-label-dark").removeClass("knob-label");
                    this.$el.appendTo("#sensor-recovercontent");
                    $("#sensor-dashboard").find("h4 small").html(" (" + $("#sensor-recovercontent .row").length + " recovered)");
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
                    //sensor_icon: this.getIcon(this.model.sensorType().toString())
                };
            }

        });

        return view;

    });
