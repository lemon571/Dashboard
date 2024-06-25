define(["jquery", "underscore", "backbone","aq_utils"],

    function($, _, Backbone, aq_utils) {

        var model = Backbone.Model.extend({

            initialize: function() {
              this.set("severity_level", aq_utils.GetSeverityLevel(this.get("Severity")));
            },

            Id: function(){ return Number(this.get("Id"))},

            timestamp: function() {
                return Date.parse(this.get("Created")) / 1000;
            },

            cause: function() {
                return this.get('Message').split(':')[0];
            },

            Message: function() {
              return this.get('Message')
            },

            Severity: function()
            {
              return this.get("Severity") || "critical";
            },

            SeverityLevel: function() {
              return this.get("severity_level");
            },

            TestSeverity: function(severity) {
              return aq_utils.GetSeverityLevel(severity) == this.SeverityLevel();
            }
        });

        return model;

    });