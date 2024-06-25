define([
  "jquery",
  "underscore",
  "backbone",
  // Models
  "models/dashboard/system_status",
], function ($, _, Backbone, SystemStatusModel) {
  var collection = Backbone.Collection.extend({
    model: SystemStatusModel,

    comparator: function(lhs, rhs)
    {
      if(lhs.get("id") == undefined || rhs.get("id") == undefined) return 0;
      return -(lhs.get("id").toLowerCase().localeCompare(rhs.get("id").toLowerCase()));
    },

    SetComponentsId: function (id) {
      this.component_id = id;
    },

    FindBadComponent: function () {
      return _.min(this.models, function (model) {
        return model.StatusLevel();
      });
    },
  });

  return collection;
});
