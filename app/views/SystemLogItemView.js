define([
    "jquery",
    "underscore",
    "backbone",

    "i18n!:common",
    //template
    'text!templates/systemlog-item.html',
    'moment'
], function($, _, Backbone, CommonStrings, SLITemplate, moment) {

    var view = Backbone.View.extend({

        tagName: "li",

        template: template(SLITemplate),

        initialize: function() {
            this.model.bind("destroy", this.removeView, this);
        },

        events: {
            //"click": "toggleDetails"
        },

        beforeRender: function() {
            //this.$el.addClass("animated fadeInDown");
        },

        afterRender: function() {
            //this.$el.addClass("timeline-item-holder sensor_" + this.model.get('sensor_number') + " " + this.model.get('record_type'));
            var datetime= "ID: " + this.model.get('id') + " " + moment(this.model.get('timestamp'), 'X').format("MMMM Do YYYY, h:mm:ss a") + "  ";
            this.$(".datetime").html(datetime);

            var hostname= "  " +this.model.get('hostname') + "  ";
            this.$(".hostname").html(hostname);

                var logdescription=this.model.get('message');
                // Remove path if existed
                if(/Build\/.build\/.*\/data/.test(logdescription))
                    logdescription = logdescription.replace(/\/.*\/Build\/.build\//i, "");

                this.$(".logdescription").html(logdescription);


                //hostname: "  " +this.model.get('hostname') + "  ",
                //logdescription: "  " +this.model.get('message'),
        },

        toggleDetails: function() {
            if (this.$el.find(".timeline-header").hasClass("expanded")) {
                this.$el.find(".timeline-header, .timeline-body, .timeline-footer").removeClass("expanded");
            } else {
                this.$el.find(".timeline-header, .timeline-body, .timeline-footer").addClass("expanded");
            }
        },

        removeView: function() {
            this.remove();
        },

        getIcon: function(type) {
            var sensor_icons = {
                "warning": "fa fa-exclamation-triangle text-yellow fa-lg",
                "ok": "fa fa-check-circle text-green fa-lg",
                "unspecified": "fa-question-circle-o fa-lg",
            };
            return sensor_icons[type] || "fa fa-times-circle text-red fa-lg";
        },

        serialize: function() {
            return {
                /*locale: CommonStrings,
                datetime: "ID: " + this.model.get('id') + " " + moment(this.model.get('timestamp'), 'X').format("MMMM Do YYYY, h:mm:ss a") + "  ",
                hostname: "  " +this.model.get('hostname') + "  ",
                logdescription: "  " +this.model.get('message'),
                fromnow: moment(this.model.get('timestamp'), 'X').fromNow(),
                cause: this.model.cause(),
                event: this.model.event(),
                event_message: this.model.get('message') + " on " + moment(this.model.get('timestamp'), 'X').format("dddd, MMMM Do YYYY, h:mm:ss a"), //"Reading went lower than Lower Critical Threshold"
                log_icon: "fa fa-flag" //this.getIcon(this.model.get('sensor_type')),*/
            };
        }

    });

    return view;

});
