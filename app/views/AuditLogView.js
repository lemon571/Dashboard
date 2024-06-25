define(['jquery', 'underscore', 'backbone', 'app',
        //data
        'collection/audit-log',
    'models/audit-log-entries',

        //subview
        'views/AuditLogItemView',
        "views/TimelineDateView",

        //template
        "text!templates/auditlog.html",

        //localize
        'i18n!:auditlog',
        //plugins
        'moment',
        // 'knob',
        // 'sparkline'
        "datepicker"
    ],

    function ($, _, Backbone, app, AuditLogCollection, AuditLogEntries, AuditLogItemView, TimelineDateView, AuditLogTemplate, CommonStrings, moment) {

        var view = Backbone.View.extend({

            template: template(AuditLogTemplate),

            initialize: function () {
                this.collection = new AuditLogCollection();
                this.collectionOriginal;
                this.audit_log_entries = new AuditLogEntries();
            },

            events: {
                "click #iddate_range_begin": "showDatePickerDateRangeBegin",
                "click #iddate_range_end": "showDatePickerDateRangeEnd",
                "click #audit-clear-log": "auditClearLog",
                "click #audit-download": "auditDownload",
                "dp.change #iddate_range_begin": "load",
                "dp.change #iddate_range_end": "load",
                "click .help-link": "toggleHelp",
                "change #idseverity": "load",
            },

            beforeRender: function() {

            },

            afterRender: function() {
            	if(sessionStorage.privilege_id < CONSTANTS["ADMIN"]){
                    app.disableAllbutton();   
                }
                app.logslimscroll();
                $('#iddate_range_begin').datetimepicker({
                    format: 'DD.MM.YYYY',
                    ignoreReadonly: true
                });
                $("#iddate_range_end").datetimepicker({
                    format: 'DD.MM.YYYY',
                    ignoreReadonly: true
                });
                var _this = this;
                this.audit_log_entries.fetch({
                    data: $.param({
                        cmd: 0
                    }),
                    success: function () {
                        _this.load.call(_this);
                    }
                });
               },

            showDatePickerDateRangeBegin: function() {
                if($("#iddate_range_begin input").val() == ''){
                    $("#iddate_range_begin").data('DateTimePicker').date(moment().startOf('day'));
                }
                $('#iddate_range_begin').data('DateTimePicker').show();
            },

            showDatePickerDateRangeEnd: function() {
                if($("#iddate_range_end input").val() == ''){
                    $("#iddate_range_end").data('DateTimePicker').date(moment());
               }
                $('#iddate_range_end').data('DateTimePicker').show();
            },

            auditClearLog: function()
            {
                var _this = this;
                if (!window.confirm(locale.t("common:confirm_clear_audit_log"))) return;
                $.ajax({
                    url : "/api/logs/audit",
                    type : "DELETE",
                    contentType : "application/json",
                    success : function(data, status, xhr) {
                        _this.audit_log_entries.fetch({
                    data: $.param({
                        cmd: 0
                    }),
                            success: function () {
                                _this.load.call(_this);
                            }
                        });
                    }
                });
            },

            auditDownload: function()
            {
                $.ajax({
                    url: "/api/logs/audit-file",
                    type: "GET",                    
                    success: function(data, status, xhr) {
                        var blob = new Blob([data], { type: 'text/plain' });
                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            window.navigator.msSaveBlob(blob, "audit.log");
                        } else {
                            var URL = window.URL || window.webkitURL;
                            var downloadURL = URL.createObjectURL(blob);
                            var a = document.createElement("a");
                            if (typeof a.download == "undefined") {
                                window.location = downloadURL;
                            } else {
                                $("#download-audit-log").attr("href", downloadURL);
                                $("#download-audit-log")[0].click();
                            }
                        }
                }
                });
            },

            load: function (model, collection, xhr) {
                app.showLoader();

                var auditLogs = this.audit_log_entries.get("entries").clone()

                var severity = this.$el.find("#idseverity").val();
                if (severity != "") {
                    auditLogs = auditLogs.bySeverity(severity);
                }

                $('#iddate_range_begin').on("dp.change", function (e) {
                    $('#iddate_range_end').data("DateTimePicker").minDate(e.date);
                });
                $('#iddate_range_end').on("dp.change", function (e) {
                   $('#iddate_range_begin').data("DateTimePicker").maxDate(e.date);
                });

                if ($("#iddate_range_begin input").val()) {
                    var start = $("#iddate_range_begin").data("DateTimePicker").date(),
                        end;

                    start = parseInt(moment(start).format('X'), 10);

                    if ($("#iddate_range_end input").val()) {
                        end = $("#iddate_range_end").data("DateTimePicker").date();
                        end = parseInt(moment(end).format('X'), 10);
                    }

                    auditLogs = this.audit_log_entries.get("entries").byDateRange(start, end);
                }
                
                this.$el.find('#event-content').html('<li><i class="fa fa-clock-o animated fadeInDown"></i></li>');

                $("#audit_entries").html("Entries: " + this.audit_log_entries.get("audit_count"));

                var groupedLog = auditLogs.groupBy(function(model) {
                    return moment(model.timestamp(), 'X').format('MMMM YYYY');
                });
                _.forEachRight(groupedLog, this.addEvents, this);
                $(".auditlogdesc").each(function(){
                    $(this).text($(this).html().replace('#tagstrt','<').replace('#tagend','>'));
                });

                app.hideLoader();
            },

            addEvents: function(modelList, title, collection) {
                app.showLoader();
                var context = this;
                var audit_list_view = new TimelineDateView({
                    date: title
                }).render().$el;

                this.$el.find('#event-content').prepend(audit_list_view);

                _.eachRight(modelList, function(model) {
                    var audit_item_view = new AuditLogItemView({
                        model: model
                    }).render().$el;
                    audit_item_view.insertAfter(audit_list_view);
                }, this);

                $(".wrapper").resize();
                $("#audit_entries").html("Entries: " + this.audit_log_entries.get("audit_count"));
                app.hideLoader();
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
