define(['jquery', 'underscore', 'backbone', 'app',
        'collection/event-log',
        'collection/dashboard_sensors',
        'text!templates/dashboard/log-details.html',
        'i18n!:log_details',
        "raphael", "morris"
    ],
    function($, _, Backbone, app, EventLogCollection, DashboardSensorCollection, LogDetailsTemplate, CommonStrings) {

        var view = Backbone.View.extend({

            template: template(LogDetailsTemplate),

            initialize: function() {
                this.bind('close', this.close, this);
                // DashboardSensorCollection.fetch()
                app.AfterRenderHitted = false;

            },

            close: function() {
                this.closed = true;
                EventLogCollection.off('loaded');
                this.donutToday = null;
                this.donutMonth = null;
            },

            beforeRender: function() {
                this.$el.addClass("row");
            },
            afterRender: function() {
                var that = this;
                this.closed = false;
                EventLogCollection.on('loaded', this.draw, this);
                if(!app.AfterRenderHitted){
                    app.AfterRenderHitted = true;
                    EventLogCollection.fetch({
                        url: "/api/logs/dashboardevent",
                        type: "GET",
                        success: function() {
                            if(EventLogCollection.length>1){
                                var max = EventLogCollection.max(function(model) {
                                    return parseInt(model.get("id"))
                                });
                                app.LASTEVENTID = max.attributes.id;
                            }
                            else{
                                app.LASTEVENTID = 0;
                            }
                            var pendingDeassertmodel = EventLogCollection.at(EventLogCollection.length-1);
                            $('#pendingDeassertions').removeClass("hide"); 
                            // $("#asserted-events-count").html(pendingDeassertmodel.get("pending_deassert"));
                            app.AfterRenderHitted = true;
                            that.draw.call(that);
                        },
                        failure: function() {
                        }
                    });
                }
            },


            draw: function() {
                var context = this;
                if(($("#donut-chart").length==0) || ($("#donut-month-chart").length==0)){
                    return;
                }
                var today = new Date();

                var lower = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).getTime() / 1000);

                var context = this;

                if (this.closed) return;

                var todaysLog = EventLogCollection.byDateRange(lower);


                $("#today-count").html(todaysLog.length);

                var sensorLogsToday = todaysLog.groupBy(function(model) {
                    var sensor;
                      if(model.get("record_type")=="oem_record"){   
                          sensor="";               
                      } else {
                          sensor = DashboardSensorCollection.getSensor(model.get('sensor_number'));
                      }
                      //var sensor = SensorCollection.getSensor(model.get('sensor_number'));
                      if (sensor) return sensor.name();
                      else if (model.get('sensor_name')=="") return "Unknown";  
                      else return model.get('sensor_name');

                });

                var todaysData = [];

                for(var j in sensorLogsToday) {
                    todaysData.push({
                        label: j,
                        value: sensorLogsToday[j].length
                    });
                }

                    if (todaysData.length) {
                        $('#donut-chart').empty();
                        context.donutToday = new Morris.Donut({
                            element: 'donut-chart',
                            data: todaysData,
                            resize: true,
                            //redraw: true,
                            formatter: function(y) {
                                return y + " event" + (y == 1 ? "" : "s");
                            }
                        });
                    }
                    console.log("drawn morris chart for today-events");
                //month chart
                
                var thismonth = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 0, 0, 0, 0).getTime() / 1000);


                //console.log(thismonth, lower);

                var thismonthLog = EventLogCollection.byDateRange(thismonth);

                $("#lastdays-count").html(thismonthLog.length);

                
                var sensorLogsMonth = thismonthLog.groupBy(function(model) {
                    var sensor;
                      if(model.get("record_type")=="oem_record"){   
                          sensor="";               
                      } else {
                          sensor = DashboardSensorCollection.getSensor(model.get('sensor_number'));
                      }
                      //var sensor = SensorCollection.getSensor(model.get('sensor_number'));
                      if (sensor) return sensor.name();
                      else if (model.get('sensor_name')=="") return "Unknown";  
                      else return model.get('sensor_name');
                });

                var monthsData = [];

                for(var k in sensorLogsMonth) {
                    monthsData.push({
                        label: k,
                        value: sensorLogsMonth[k].length
                    });
                }


                if(monthsData.length === 0) return;
                else this.$(".nothing-30day").hide();

                    if (monthsData.length) {
                        $('#donut-month-chart').empty();
                        context.donutMonth = new Morris.Donut({
                            element: 'donut-month-chart',
                            data: monthsData,
                            resize: true,
                            //redraw: true,
                            formatter: function(y) {
                                return y + " event" + (y == 1 ? "" : "s");
                            }
                        });
                    }

                if(todaysData.length === 0) return;
                else this.$(".nothing-today").hide();
            },
/*
            drawFromDb: function() {
                var today = new Date();

                var lower = (new Date(today.getFullYear(), today.getMonth(), today.getDay(), 0, 0, 0, 0).getTime() / 1000);

                var context = this;

                app.db.from('ipmi_events').where('timestamp', '>=', lower)
                    .list()
                    .done(function(results) {

                        var i = 0,
                            todaysEventLog = {};
                        for (i = 0; i < results.length; i++) {
                            if (todaysEventLog[results[i].sensor_name]) {
                                todaysEventLog[results[i].sensor_name]++;
                            } else {
                                todaysEventLog[results[i].sensor_name] = 1;
                            }
                        }

                        var j, todaysData = [];

                        for (j in todaysEventLog) {
                            todaysData.push({
                                label: j,
                                value: todaysEventLog[j]
                            });
                        }

                        if(todaysData.length === 0) return;
                        else this.$(".nothing-today").hide();

                        if (!context.donutToday) {
                            if (todaysData.length) {
                                context.donutToday = new Morris.Donut({
                                    element: 'donut-chart',
                                    data: todaysData,
                                    formatter: function(y) {
                                        return y + " event" + (y == 1 ? "" : "s");
                                    }
                                });
                            }

                            console.log("drawn morris chart for today-events");
                        } else {
                            context.donutToday.setData(todaysData);
                        }

                    });

                var thismonth = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 30, 0, 0, 0, 0).getTime() / 1000;

                app.db.from('ipmi_events').where('timestamp', '>=', thismonth)
                    .list()
                    .done(function(results) {
                        var i = 0,
                            monthsEventLog = {};
                        for (i = 0; i < results.length; i++) {
                            if (monthsEventLog[results[i].sensor_name]) {
                                monthsEventLog[results[i].sensor_name]++;
                            } else {
                                monthsEventLog[results[i].sensor_name] = 1;
                            }
                        }

                        var j, monthsData = [];

                        for (j in monthsEventLog) {
                            monthsData.push({
                                label: j,
                                value: monthsEventLog[j]
                            });
                        }

                        if(monthsData.length === 0) return;
                        else this.$(".nothing-30day").hide();

                        if (!context.donutMonth) {
                            if (monthsData.length) {
                                context.donutMonth = new Morris.Donut({
                                    element: 'donut-month-chart',
                                    data: monthsData,
                                    formatter: function(y) {
                                        return y + " event" + (y == 1 ? "" : "s");
                                    }
                                });
                            }

                        } else {
                            context.donutMonth.setData(monthsData);
                        }
                    });

            },
*/
            serialize: function() {
            return {
                locale: CommonStrings
            };
        }

        });

        return view;

    });
