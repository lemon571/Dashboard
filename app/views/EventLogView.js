define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    "collection/event-log",
    "collection/sensors",
    "collection/messages",
    "views/TimelineItemView",
    "i18n!:common",
    //template
    'text!templates/eventlog.html',
    //plugins
    "moment",
    "chartjs",
    "datepicker"
], function($, _, Backbone, app, EventLogCollection, SensorsCollection, MessageCollection, TimelineItemView, CommonStrings, LogTemplate, moment) {

    //var Chartjs = Chart.noConflict();

    var view = Backbone.View.extend({

        template: template(LogTemplate),

        initialize: function() {
            this.collection = EventLogCollection;

            SensorsCollection.bind("add", this.addSensor, this);
            this.bind('close', this.close, this);
            this.totallogEntries = 0;
            this.collectionOriginal;
            // scroll change initial parameters
            this.EventId = 0;
            this.EventTop = 0;
            this.EventBottom = 0;
            this.totalEventCollection;
        },

        close: function() {
            // To avoid defining the add event repeatedly, otherwise the callback function will be called multiple times.
            SensorsCollection.off('add');
        },

        events: {
            "click #iddate_range_begin": "showDatePickerDateRangeBegin",
            "click #iddate_range_end": "showDatePickerDateRangeEnd",
            "change #idsensor": "filter",
            "change #idevent_type": "filter",
            "change #idseverity": "filter",
            "dp.change #iddate_range_begin": "loaddate",
            "dp.change #iddate_range_end": "loaddate",
            "click #idcl_log": "sendClearSEL",
            "click #idsave_log": "saveSEL",
            "click .help-link": "toggleHelp"
        },

        beforeRender: function() {},

        afterRender: function() {

            app.logslimscroll();

            $(".ipmi-log-count").hide();
            window.sessionStorage.setItem("newEventCount", 0);
            $('#idcl_log').prop('disabled', sessionStorage.privilege_id <= CONSTANTS["OPERATOR"]);

            _.invoke(MessageCollection.toArray(), 'destroy');
            this.$el.find('input[name="time_zone"]').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%'
            });

            var context = this,
                startDate = null,
                endDate = null;

            $('#iddate_range_begin').datetimepicker({
                // pickTime: false,
                // maxDate: new Date(),
                format: 'DD.MM.YYYY',
                ignoreReadonly: true
            });
            $("#iddate_range_end").datetimepicker({
                // pickTime: false,
                // minDate: new Date(),
                format: 'DD.MM.YYYY',
                ignoreReadonly: true
            });

            this.filterKey = location.hash.split('/').pop();

            if (this.filterKey == "today") {
                startDate = moment().startOf('day');
                endDate = moment();
            } else if (this.filterKey == "month") {
                startDate = moment().subtract(30, 'days');
                endDate = moment();
            } else if (this.filterKey != "event-log") {
                if (!isNaN(this.filterKey)) {
                    $("#idsensor").val(this.filterKey);
                }
            }

            /*Initial fetch call
            EVENTID = app.LASTEVENTID (For latest Event Id)*/

            var context = this;

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
                    context.collection.fetch({
                        url: "/api/logs/eventlog",
                        type: "GET",
                        data: $.param({
                            EVENTID: -1 // -1 for latest logs
                        }),
                        success: function() {
                            //If empty means load the current context
                            if (context.collection.length > 0) {
                                context.totalEventCollection = context.collection.clone();
                                var max = context.collection.max(function(model) {
                                    return parseInt(model.get("id"))
                                });
                                var min = context.collection.min(function(model) {
                                    return parseInt(model.get("id"))
                                });
                                context.EventId = min.attributes.id; // Assign the min eventId
                                context.EventBottom = min.attributes.id;
                                context.EventTop = max.attributes.id; // Assign the max eventId
                                $("#iddate_range_begin").data('DateTimePicker').date(startDate);
                                $("#iddate_range_end").data('DateTimePicker').date(endDate);
                            } else {}
                            context.load.call(context);
                        },
                        failure: function() {}
                    });
                },
                failure: function() {
                }
            });

            SensorsCollection.reset();
            SensorsCollection.fetch({
                success: function() {
                    if (!isNaN(context.filterKey)) {
                        $("#idsensor").val(context.filterKey);
                        context.filter();
                    }
                }
            });

            if (sessionStorage.privilege_id < CONSTANTS["OPERATOR"]) {
                app.disableAllbutton();
            }

            this.scrollOn = true;
            var timezoneOffset = 0;
            var abstimezoneOffset = 0;
            var gmtString = "";
            var pad = "00";
            var hours = 0;
            var minutes = 0;

            timezoneOffset = new Date().getTimezoneOffset();

            gmtString = timezoneOffset < 0 ? " GMT+" : " GMT-";

            abstimezoneOffset = Math.abs(timezoneOffset);

            hours = (pad + (parseInt(abstimezoneOffset / 60))).slice(-2);
            minutes = (pad + (parseInt(abstimezoneOffset % 60))).slice(-2);

            gmtString = gmtString + hours + ":" + minutes;

            $('#idUTCOffset').html(gmtString);

            $("#iddivscrollsection").bind("scroll", function() {

                var divScrollTop = $(this).scrollTop();
                var divInnerHeight = $(this).innerHeight();
                var divScrollHeight = $(this)[0].scrollHeight;

                if ((divScrollTop + divInnerHeight >= divScrollHeight) && context.scrollOn) {

                    if (context.EventBottom == context.EventId && context.totalEventCollection.length > 299) { //Length is greater than 299

                        context.scrollOn = false;

                        context.collection.fetch({
                            url: "/api/logs/eventlog",
                            data: $.param({
                                EVENTID: context.EventId - 1
                            }),
                            success: function() {
                                if (context.collection.length > 0) {

                                    context.totalEventCollection.add(context.collection.toJSON(), { silent: true });

                                    var max = context.collection.max(function(model) {
                                        return parseInt(model.get("id"))
                                    });

                                    var min = context.collection.min(function(model) {
                                        return parseInt(model.get("id"))
                                    });

                                    context.EventId = min.attributes.id;
                                    context.EventBottom = min.attributes.id;
                                    context.EventTop = max.attributes.id;

                                    context.load.call(context);

                                    $("#iddivscrollsection").animate({
                                        scrollTop: divScrollHeight
                                    }, 2000);
                                } else {
                                    context.collection = context.totalEventCollection;
                                }
                                if (context.EventId == 1) {
                                    context.scrollOn = false;
                                } else {
                                    context.scrollOn = true;
                                }
                            },
                            failure: function() {}
                        });
                    } else {
                        if (context.totalEventCollection.length > 299) {

                            var eventid = (context.EventId == context.EventBottom) ? context.EventBottom : context.EventBottom + 300;

                            var max = context.totalEventCollection.max(function(model) {
                                return parseInt(model.get("id"))
                            });

                            var min = context.totalEventCollection.min(function(model) {
                                return parseInt(model.get("id"))
                            });
                            context.EventBottom = min.attributes.id;
                            context.EventTop = max.attributes.id;
                            context.load.call(context);
                            $("#iddivscrollsection").animate({
                                scrollTop: divScrollHeight
                            }, 2000);
                        }
                    }
                }
            });
        },

        showDatePickerDateRangeBegin: function() {
            $('#iddate_range_begin').data('DateTimePicker').show();
        },

        showDatePickerDateRangeEnd: function() {
            if($("#iddate_range_end input").val() == ''){
                $("#iddate_range_end").data('DateTimePicker').date(moment());
           }
            $('#iddate_range_end').data('DateTimePicker').show();
        },

        sendClearSEL: function() {
            var context = this;
            if (window.confirm(locale.t("common:confirm_clear_ipmi_event_log"))) {
                $.ajax({
                    url: "/api/logs/event",
                    type: "DELETE",
                    success: function() {
                     Backbone.history.loadUrl(Backbone.history.fragment);
                    },
                    error: app.HTTPErrorHandler
                });
            }
        },

        saveSEL: function() {
            var context = this;
            $.ajax({
                type: "GET",
                url: "/api/logs/event-file",
                success: function(response, status, xhr) {
                    var filename = "SELLog";
                    var blob = new Blob([response], { type: 'text/plain' });
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadURL = URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        if (typeof a.download == "undefined") {
                            window.location = downloadURL;
                        } else {
                            $("#downloadLink").attr("href", downloadURL);
                            $("#downloadLink")[0].click();
                        }
                    }
                }
            });
        },

        loaddate: function() {
            var context = this;
            if ($("#iddate_range_begin input").val()) {
                var start = $("#iddate_range_begin").data("DateTimePicker").date(),
                    end;
                start = parseInt(moment(start).format('X'), 10);
                if ($("#iddate_range_end input").val()) {
                    end = $("#iddate_range_end").data("DateTimePicker").date();
                    end = parseInt(moment(end).format('X'), 10);
                }
                context.load.call(context);
            }
        },

        load: function() {
            var elSensor = this.$el.find("#idsensor"),
                elEventType = this.$el.find("#idevent_type");
            if (!this.collectionOriginal) {
                this.collectionOriginal = this.collection.clone();
            } else {
                this.collectionOriginal = this.totalEventCollection.clone();
            }

            this.collection = this.collectionOriginal;
            var eventLogs = this.collection;

            var sensor_id = elSensor.val(),
                event_type = elEventType.val();

            if (sensor_id != "" && sensor_id.indexOf("_") > -1) {
                sensor_val = sensor_id.split('_');
                sensor_id = sensor_val[0];
            }
            if (sensor_id != "" && event_type != "") {
                eventLogs = this.collection.bySensorandEventtype(sensor_id, event_type);
                this.collection = eventLogs;
            } else if (sensor_id != "") {
                eventLogs = this.collection.bySensor(sensor_id, 10);
                this.collection = eventLogs;
            } else if (event_type != "") {
                eventLogs = this.collection.byEventtype(event_type);
                this.collection = eventLogs;
            }
            if (this.filterKey == "deasserted") {
                eventLogs = this.collection.byPendingDeassertion();
            }

            if ($("#iddate_range_begin input").val()) {

                var start = $("#iddate_range_begin").data("DateTimePicker").date(),
                    end;

                start = parseInt(moment(start).format('X'), 10);

                if ($("#iddate_range_end input").val()) {
                    end = $("#iddate_range_end").data("DateTimePicker").date();
                    end = parseInt(moment(end).format('X'), 10);
                }
                eventLogs = this.collection.byDateRange(start, end);
            }

            this.$el.find('#event-content').html("");

            // this.$el.find('#event-content').html('<li><i class="fa fa-clock-o animated fadeInDown"></i></li>');

            $("#eventlength").html("Event Log: 0 out of " + this.collectionOriginal.length + " event entries");

            var groupedLog = eventLogs.groupBy(function(model) {
                if(model.get('event_description') == "oem_non_timestamped"){
                    return title=CommonStrings.t("common:oem_non_timestamped");
                }else{
                    return moment(model.get('timestamp'), 'X').format('MMMM YYYY');
                }
            });
            _.forEachRight(groupedLog, this.addEvents, this);
        },

        addSensor: function(model, collection) {
            var o = model.get("name"),
                v = model.get("sensor_number") + "_" + model.get("owner_lun"),
                option = $("<option>").attr("value", v).html(o);
            this.$el.find("#idsensor").append(option);
        },

        addEvents: function(modelList, title, collection) {
            if (title == "January 1970") title = CommonStrings.t("common:pre_init_timestamp"); //Non timestamp default date.
            var context = this;
            // var tdv = new TimelineDateView({
            //     date: title
            // }).render().$el;
            // this.$el.find('#event-content').prepend(tdv);
            _.eachRight(modelList, function(model) {
                if (model.get('sensor_type') == '' && model.get('event_reading_class') != "oem") { //checked for OEM event
                  return;
                }
                var tiv = new TimelineItemView({
                    model: model
                }).render().$el;
                this.$el.find('#event-content').prepend(tiv);
                // tiv.insertAfter(tdv);
            }, this);
            var filterClass = ".eventlog-item-holder";
            $("#eventlength").html("Event Log: " + $(filterClass).length + " out of " + app.LASTEVENTID + " event entries");
        },

        filter: function() {
            var context = this;
            var lun_val = 0;
            var elSensor = this.$el.find("#idsensor"),
                elEventType = this.$el.find("#idevent_type"),
                elSeverity = this.$el.find("#idseverity");
            var sval = elSensor.val(),
                etval = elEventType.val(),
                sevval = elSeverity.val();
            if (sval.indexOf("_") > -1) {
                sensor_val = sval.split('_');
                sval = sensor_val[0];
                lun_val = sensor_val[1];
            }
            context.filteredChart(sval, lun_val, etval, sevval);
        },

        filteredChart: function(sensor_id, lun_number, event_type, severity) {
            this.collection = this.collectionOriginal;
            var eventLogs = this.collection;
            var context = this;
            if (context.chart != null)
                context.chart.destroy();

            if (severity != "") {
                eventLogs = context.collection.bySeverity(severity);
                context.collection = eventLogs;
            }

            if (event_type == "system_event_record" || event_type == "") {
                this.$el.find("#idsensor").removeAttr("disabled");
            } else {
                this.$el.find("#idsensor").attr("disabled", "disabled");
            }
            if (sensor_id != "" && event_type != "" && lun_number != "") {
                eventLogs = context.collection.bySensorLunandEventtype(sensor_id, lun_number, event_type);
                context.collection = eventLogs;
            } else if (sensor_id != "" && lun_number != "") {
                eventLogs = context.collection.bySensorandLun(sensor_id, lun_number, 10);
                context.collection = eventLogs;
            } else if (event_type != "") {
                eventLogs = context.collection.byEventtype(event_type);
                context.collection = eventLogs;
            }
            if ($("#iddate_range_begin input").val()) {
                var start = $("#iddate_range_begin").data("DateTimePicker").date(),
                    end;
                start = parseInt(moment(start).format('X'), 10);
                if ($("#iddate_range_end input").val()) {
                    end = $("#iddate_range_end").data("DateTimePicker").date();
                    end = parseInt(moment(end).format('X'), 10);
                }
                eventLogs = this.collection.byDateRange(start, end);
            }
            this.$el.find('#event-content').html("");
            // this.$el.find('#event-content').html('<li><i class="fa fa-clock-o animated fadeInDown"></i></li>');
            $("#eventlength").html("Event Log: 0 out of " + context.collectionOriginal.length + " event entries");
            var groupedLog = eventLogs.groupBy(function(model) {
                if(model.get('event_description') == "oem_non_timestamped"){
                    return title=CommonStrings.t("common:oem_non_timestamped");
                }else{
                    return moment(model.get('timestamp'), 'X').format('MMMM YYYY');
                }
            });
            _.forEachRight(groupedLog, context.addEvents, this);
        },

        toggleHelp: function(e) { app.helpContentCheck(e, this); },

        serialize: function() {
            return {
                locale: CommonStrings
            };
        }
    });
    return view;
});
