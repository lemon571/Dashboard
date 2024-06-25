define(['jquery', 'underscore', 'backbone', 'app',
        //data

        //localize
        'i18n!:common',
        //template
        'text!templates/normal-sensor.html',
        //plugins
        // 'moment',
        // 'knob',
        'chartjs'
    ],

    function($, _, Backbone, app, CommonStrings, SensorTemplate, chartjs) {

        var view = Backbone.View.extend({

            tagName: "tr",

            template: template(SensorTemplate),

            initialize: function() {
                this.model.bind("change:reading", this.updateReading, this);
                this.model.bind("change:sensor_state", this.updateState, this);
            },

            events: {
                "click": "showDetails"
            },

            beforeRender: function() {
                this.$el.attr("id", "normal-sensor-" + this.model.get('sensor_number'));
            },

            afterRender: function() {
                // this.setView(".behavior", new SensorGraphView({
                //     model: this.model,
                //     graphSettings: {}
                // })).render();



                this.currentReading = this.model.reading();
                var reading = 0;
                if(this.model.reading() != undefined)
                    reading = this.model.reading();


                var  name= this.model.name();
                var unit= this.model.unit();
                reading = reading != Math.floor(reading) ? reading.toFixed(2) : Math.floor(reading);
                var sensor_type_icon= this.getIcon(this.model.sensorType().toString());

                this.$(".normal_sensor_name").html(name);
                this.$(".reading").html(reading);
                this.$(".units").html(unit);

                this.$(".sensor_type_icon").addClass(sensor_type_icon);

                this.drawchart();


                // this.maxGraphPoints = 30;

                // var context = this;

                // this.timer = setInterval(function() {
                //     //context.readings.push(context.currentReading);
                //     var sensor_readings = app.readings['sensor_' + context.model.get('sensor_number')];

                //     if (sensor_readings.length > context.maxGraphPoints) {
                //         sensor_readings = sensor_readings.slice(sensor_readings.length - context.maxGraphPoints, sensor_readings.length);
                //     }

                //     context.$el.find(".sparkline-graph").sparkline(sensor_readings, {
                //         type: 'line',
                //         tooltipSuffix: ' ' + context.model.unit()
                //     });
                // }, 2500);
                // $("#normal-sensor-content .sparkline-graph").sparkline([1, 10, 9, -1, -5, 5, 7, 0, 0, 3, -1, 8, 1, 1, 10, 9, -1, -5, 5, 7, 0, 0, 3, -1, 8, 1], {
                //     type: 'line'
                // });
               
            },

            load: function(model, collection, xhr) {

            },

          drawchart: function () {
            var line_chart;
            var context = this;
            this.timer = setInterval(function () {
              //context.readings.push(context.currentReading);
              var sensor_readings = [];

              if (app.readings != undefined) {
                var reading_to_check = app.readings['sensor_' + context.model.get('sensor_number') + '_' + context.model.get('owner_lun')];
                if (reading_to_check != undefined) {
                  sensor_readings = _.pluck(app.readings['sensor_' + context.model.get('sensor_number') + '_' + context.model.get('owner_lun')], 'reading');
                }

                if (sensor_readings.length > context.maxGraphPoints) {
                  sensor_readings = sensor_readings.slice(sensor_readings.length - context.maxGraphPoints, sensor_readings.length);
                }
              }

              // context.$el.sparkline(sensor_readings, _.extend(settings, {
              //     lineColor: (context.model.isCritical() ? '#00C0EF' : 'purple')
              // }));
              // Firefox 1.0+
              //var isFirefox = typeof InstallTrigger !== 'undefined';

              // Internet Explorer 6-11
              var isIE = /*@cc_on!@*/false || !!document.documentMode;

              // Edge 20+
              var isEdge = !isIE && !!window.StyleMedia;

              // Chrome 1 - 71
              //var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
              var chartFontSize = 45;
              var chartborderWidth = 3;
              if (isEdge || isIE) {
                chartFontSize = 20;
                chartborderWidth = 2;
              }

              var data = {
                labels: sensor_readings,
                datasets: [{
                  data: sensor_readings,
                  fill: true,
                }]
              };

              var options = {
                responsive: false,
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
                  bodyFontSize: chartFontSize,
                  displayColors: false,
                  callbacks: {
                    title: function (tooltipItems, data) {
                      return '';
                    },
                    label: function (tooltipItem, data) {
                      return tooltipItem.yLabel + ' ' + context.model.unit();
                    }
                  },
                  mode: 'label',
                  intersect: false
                  // yAlign: 'left'
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
                    borderWidth: chartborderWidth
                  },
                  point: {
                    radius: 0
                  }
                }
              }
              if (line_chart) {
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

            showDetails: function() {
                app.router.navigate("sensors/"+this.model.get('owner_lun')+"/"+this.model.get('sensor_number'), {trigger: true});
            },

            updateReading: function(model, value, xhr) {
                this.$el.find(".reading").html(model.reading());
                this.currentReading = model.reading();
            },

            updateState: function(model, value, xhr) {
                if (model.get('sensor_state') >= 0x02) {
                    clearInterval(this.timer);
                    this.remove();
                }
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

            serialize: function() {
                this.currentReading = this.model.reading();
                var reading = 0;
                if(this.model.reading() != undefined)
                    reading = this.model.reading();

                return {
                    locale: CommonStrings
                    /*name: this.model.name(),
                    reading: reading.toFixed(2),
                    unit: this.model.unit(),
                    sensor_type_icon: this.getIcon(this.model.sensorType().toString())*/
                };
            }

        });

        return view;

    });
