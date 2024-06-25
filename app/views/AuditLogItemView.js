define([
    "jquery",
    "underscore",
    "backbone",

    "i18n!:common",
    //template
    'text!templates/auditlog-item.html','moment'
], function($, _, Backbone, CommonStrings, ALITemplate,moment) {

    var view = Backbone.View.extend({

        tagName: "li",

        template: template(ALITemplate),

        initialize: function() {
            this.model.bind("destroy", this.removeView, this);
        },

        afterRender: function() {
            var message_id = this.model.Id();
            var datetime = moment(this.model.timestamp(), 'X').format("MMMM Do YYYY, h:mm:ss a");
            var message = this.model.Message().replace(/</g,'#tagstrt').replace(/>/g,'#tagend');   //To avoid HTML tags in message

            this.$(".logseverity").html("ID: " + message_id);
            this.$(".datetime").html(datetime + " ");
            this.$(".auditlogdesc").html(message);
            this.$(".sensor_icon").removeClass('sensor_icon').addClass(
              this.getSeverityIcon(this.model.SeverityLevel())
            );
        },

        getSeverityIcon: function(severity_level)
        {
          const severity_icons = [
            "fa fa-times-circle text-red fa-lg", // 0 - Critical
            "fa fa-exclamation-triangle text-yellow fa-lg",// 1 - Warning
            "fa fa-check-circle text-green fa-lg" // 2 - OK
          ]

          return severity_icons[severity_level] || "fa fa-times-circle text-red fa-lg";
        },

        serialize: function() {
            return {};
        }

    });

    return view;

});