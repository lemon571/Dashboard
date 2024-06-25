define(['jquery', 'underscore', 'backbone', 'app',
        //data
        'collection/system-log',

        //subview
        'views/SystemLogItemView',
        "views/TimelineDateView",

        //template
        "text!templates/systemlog.html",

        //localize
        'i18n!:systemlog',
        //plugins
        'moment',
        // 'knob',
        // 'sparkline'
        "datepicker"
    ],

    function($, _, Backbone, app, SystemLogCollection, SystemLogItemView, TimelineDateView, SystemLogTemplate, CommonStrings, moment) {

        var view = Backbone.View.extend({

            template: template(SystemLogTemplate),

            initialize: function() {

                this.collection = SystemLogCollection;
                this.collectionOriginal;

                //this.collection.bind("add", this.load, this);

            },

            events: {
                "click #iddate_range_begin": "showDatePickerDateRangeBegin",
                "click #iddate_range_end": "showDatePickerDateRangeEnd",
                "change #idevent_type": "changeCategory",
                "dp.change #iddate_range_begin": "load",
                "dp.change #iddate_range_end": "load",
                "click .help-link": "toggleHelp"
            },

            beforeRender: function() {

            },

            afterRender: function() {
            	if(sessionStorage.privilege_id < CONSTANTS["ADMIN"]){
                    app.disableAllbutton();   
                 }
		 app.logslimscroll();
                $('#iddate_range_begin').datetimepicker({
                    //                pickTime: false
                                    //   minDate: new Date(),
                    format: 'DD.MM.YYYY',
                    ignoreReadonly: true
                });
                $("#iddate_range_end").datetimepicker({
                    //                pickTime: false
                                    //   minDate: new Date(),
                    format: 'DD.MM.YYYY',
                    ignoreReadonly: true
                });
                this.changeCategory();
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

            changeCategory: function() {
                var context = this;
                this.collection.fetch({
                    data: $.param({
                        level: this.$el.find("#idevent_type").val()
                    }),
                    success: function() {
                        context.load.call(context);
                    }
                });
            },

            load: function(model, collection, xhr) {

                console.log(this.collectionOriginal);
                if(!this.collectionOriginal){
                    this.collectionOriginal = this.collection.clone();
                }

                this.collection = this.collectionOriginal;

                var context = this;

                var systemLogs = this.collection;

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

                    systemLogs = this.collection.byDateRange(start, end);
                    console.log("loading events...");
                }

                this.$el.find('#event-content').html('<li><i class="fa fa-clock-o animated fadeInDown"></i></li>');

                $("#sysloglength").html("System Log: "+ "0" + " out of "+ context.collectionOriginal.length + " event entries");

                var groupedLog = systemLogs.groupBy(function(model) {
                    //return moment(model.get('timestamp'), 'X').format('MMM Do YYYY');
                    return moment(model.get('timestamp'), 'X').format('MMMM YYYY');
                });
                _.forEachRight(groupedLog, this.addEvents, this);


            },

            addEvents: function(modelList, title, collection) {
                //console.log("add", arguments);
                //now render the date
                var context = this;

                var tdv = new TimelineDateView({
                    date: title
                }).render().$el;

                //this.chartData.labels.push(title);
                //this.chartData.data.push(modelList.length);

                //this.chart.addData([modelList.length], title);

                this.$el.find('#event-content').prepend(tdv);

                _.eachRight(modelList, function(model) {

                    var siv = new SystemLogItemView({
                        model: model
                    }).render().$el;

                    siv.insertAfter(tdv);
                    $(".wrapper").resize();

                }, this);

                $("#sysloglength").html("System Log: "+ $(".timeline-item").length + " out of "+ context.collectionOriginal.length + " event entries");

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