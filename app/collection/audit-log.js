define([
    "jquery", "underscore", "backbone",
    "models/audit-log"
],

    function ($, _, Backbone, AuditLogModel) {

        var collection = Backbone.Collection.extend({
            model: AuditLogModel,
            parse: function (data) { return data.entries; },
            comparator: function (model) { return (Math.floor(new Date().getTime() / 1000) - model.timestamp() - model.Id()); },

            byDateRange: function (start, end) {

                if (!end) {
                    end = Math.floor(new Date().getTime() / 1000);
                }

                var filtered = this.filter(function (model) {
                    var timestamp = parseInt(model.timestamp(), 10);
                    return (timestamp >= start && timestamp <= end);
                });

                return new collection(filtered);

            },
            bySeverity: function (severity) {
                return new collection(this.filter(function (model) {
                  return model.TestSeverity(severity);
              }));
            },

        });

        return collection;

    });
