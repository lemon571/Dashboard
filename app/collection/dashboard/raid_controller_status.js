define([
  "jquery",
  "underscore",
  "backbone",
  // Models
  "models/dashboard/physical_device_status",
], function ($, _, Backbone, SystemStatusModel) {
  var collection = Backbone.Collection.extend({
    model: SystemStatusModel,

    comparator: function (lhs, rhs) {
      if (lhs.get("dev_id") == undefined || rhs.get("dev_id") == undefined)
        return 0;
      return lhs.Id() > rhs.Id();
    },

    FindBadComponent: function () {
      return _.max(this.models, function (model) {
        return model.Status();
      });
    },
  });

  return collection;
});
