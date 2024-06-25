define([
  "jquery",
  "underscore",
  "backbone",
  // Models
  "models/dashboard/system_status",
], function ($, _, Backbone, SystemStatusModel) {
  var collection = Backbone.Collection.extend({
    model: SystemStatusModel,

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
