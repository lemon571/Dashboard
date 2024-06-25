define(['jquery', 'underscore', 'backbone', 'app',
    'collection/tasks',
    'text!templates/dashboard/calendar.html',
    'i18n!:calendar',
    'moment',
],
    function ($, _, Backbone, app, TaskCollection, CalendarView, CommonStrings, moment) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.collection = TaskCollection;
                //app.configurations.bind('features_loaded', this.afterFeatures, this);
                this.calAfterRenderHitted = false;
                //this.getTaskCollection();
            },
            template: template(CalendarView),
            beforeRender: function () {
                if(localStorage.select_lang!=undefined){
                    this.calAfterRenderHitted = false;
                }
            },
            afterRender: function () {
                var that = this;
                if(!this.calAfterRenderHitted){
                    if (app.configurations.isFeatureAvailable("AUTOMATION")) {
                        that.calAfterRenderHitted = true;
                        this.collection.fetch({
                            success: function () {
                                that.load();
                            }
                        });
                    }
                }
            },
            afterFeatures: function () {
                var that = this;
                if (app.features.indexOf('AUTOMATION') == -1) return;
                this.collection.fetch({
                    success: function () {
                        that.load();
                    }
                });
            },
            load: function () {
                var ae_events = TaskCollection.map(function (model) {
                    var ev = {};
                    ev.title = model.get('task_title');
                    ev.start = moment.unix(model.get('schedule').start_time).toISOString();

                    ev.task_id = model.get('id');
                    var repeat = model.get('schedule').repeats;
                    var scheduleEnds = model.get('schedule').ends;
                    var scheduleEndsType = model.get('schedule').ends_type;
                    var repeatInterval = model.get('schedule').repeat_interval;
                    var startTime = model.get('schedule').start_time;
                    var repeatOn = model.get('schedule').repeat_on;
                    switch (repeat) {
                        case 0: //Every Minute
                            // If ends time not specify means
                            if (scheduleEnds == 0 || scheduleEnds == undefined || scheduleEnds == null) {
                                // No end date so we mentioned maximum BMC supported date as per NTP
                                ev.end = moment.unix(2171551303).toISOString();

                            } else if (scheduleEndsType == 'occurrence') {
                                var occurrenceCount = scheduleEnds; // If Minute no end date means  they pass the occurrence value in @ends parameter
                                var totalOccuranceMinutes = (repeatInterval * 60) * (occurrenceCount); // Convert Minute to Milliseconds
                                ev.end = startTime + totalOccuranceMinutes;
                                ev.end = moment.unix(ev.en).toISOString();
                            } else {
                                ev.end = moment.unix(scheduleEnds).toISOString();
                            }
                            break;
                        case 1: //Every hour
                            // If ends time not specify means
                            if (scheduleEnds == 0 || scheduleEnds == undefined || scheduleEnds == null) {
                                // No end date so we mentioned maximum BMC supported date as per NTP
                                ev.end = moment.unix(2171551303).toISOString();
                            } else if (scheduleEndsType == 'occurrence') {
                                var occurrenceCount = scheduleEnds; // If Minute no end date means  they pass the occurrence value in @ends parameter
                                var totalOccuranceMinutes = (repeatInterval * 60 * 60) * (occurrenceCount); // Convert Hour to Milliseconds
                                ev.end = startTime + totalOccuranceMinutes;
                            } else {
                                ev.end = moment.unix(scheduleEnds).toISOString();
                            }
                            break;
                        case 2: //Daily
                            // If ends time not specify means
                            if (scheduleEnds == 0 || scheduleEnds == undefined || scheduleEnds == null) {
                                // No end date so we mentioned maximum BMC supported date as per NTP
                                ev.end = moment.unix(2171551303).toISOString();
                            } else if (scheduleEndsType == 'occurrence') {
                                var occurrenceCount = scheduleEnds; // If Minute no end date means  they pass the occurrence value in @ends parameter

                                var totalOccuranceMinutes = (repeatInterval * 60 * 60 * 24) * (occurrenceCount - 1); // Convert Day to Milliseconds

                                ev.end = startTime + totalOccuranceMinutes;
                            } else {
                                ev.end = moment.unix(scheduleEnds).toISOString();
                            }
                            break;
                        case 3: //Weekly
                            // If ends time not specify means
                            if (scheduleEnds == 0 || scheduleEnds == undefined || scheduleEnds == null) {
                                // No end date so we mentioned maximum BMC supported date as per NTP
                                ev.end = moment.unix(2171551303).toISOString();
                            } else if (scheduleEndsType == 'occurrence') {
                                var occurrenceCount = scheduleEnds; // If Minute no end date means  they pass the occurrence value in @ends parameter
                                var totalOccuranceMinutes = (repeatInterval * 60 * 60 * 24 * 7) * (occurrenceCount); // Convert Week to Milliseconds
                                ev.end = startTime + totalOccuranceMinutes;
                            } else {
                                ev.end = moment.unix(scheduleEnds).toISOString();
                            }
                            ev.dow = repeatOn;
                            break;
                        case 4: //Monthly
                            // If ends time not specify means
                            if (scheduleEnds == 0 || scheduleEnds == undefined || scheduleEnds == null) {
                                // No end date so we mentioned maximum BMC supported date as per NTP
                                ev.end = moment.unix(2171551303).toISOString();
                            } else if (scheduleEndsType == 'occurrence') {
                                var occurrenceCount = scheduleEnds; // If Minute no end date means  they pass the occurrence value in @ends parameter
                                var totalOccuranceMinutes = (repeatInterval * 60 * 60 * 24 * 30) * (occurrenceCount); // Month to Milliseconds
                                var startYear = moment.unix(startTime).format("YYYY");
                                var isLeap = moment([startYear]).isLeapYear()
                                if (isLeap) {
                                    ev.end = startTime + totalOccuranceMinutes + (24 * 60 * 60);
                                } else {
                                    ev.end = startTime + totalOccuranceMinutes;
                                }
                            } else {
                                ev.end = moment.unix(scheduleEnds).toISOString();
                            }
                            break;
                        case 5: //Yearly
                            // If ends time not specify means
                            if (scheduleEnds == 0 || scheduleEnds == undefined || scheduleEnds == null) {
                                // No end date so we mentioned maximum BMC supported date as per NTP
                                ev.end = moment.unix(2171551303).toISOString();
                            } else if (scheduleEndsType == 'occurrence') {
                                var occurrenceCount = scheduleEnds; // If Minute no end date means  they pass the occurrence value in @ends parameter
                                var totalOccuranceMinutes = (repeatInterval * 60 * 60 * 24 * 365) * (occurrenceCount); // Convert Year to Milliseconds
                                ev.end = startTime + totalOccuranceMinutes;
                            } else {
                                ev.end = moment.unix(scheduleEnds).toISOString();
                            }
                            break;
                    }
                    return ev;
                });
                //Calendar
                $('#calendar').fullCalendar({

                    backgroundColor: "#0073b7", //Blue
                    borderColor: "#0073b7", //Blue
                    displayEventTime : false,
                    events: ae_events,
                    eventClick: function (event) {
                        var task_id = event.task_id;
                        var path = "#tasks/" + task_id;
                        app.router.navigate(path, {
                            trigger: true
                        });
                    },
                    eventMouseover: function (event) {
                        $(this).css({ "cursor": "pointer" });
                    }
                });

            },
            serialize: function () {
                return {
                    locale: CommonStrings
                };
            }
        });
        return view;
    });
