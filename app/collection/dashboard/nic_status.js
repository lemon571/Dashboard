define([
    "jquery",
    "underscore",
    "backbone",
    // Models
    "models/dashboard/nic_channel_status",
  ], function ($, _, Backbone, NicChannelModel) {
    var collection = Backbone.Collection.extend({
      model: NicChannelModel,
      comparator: function (lhs, rhs) {
        if (lhs.get("channel") == undefined || rhs.get("channel") == undefined)
          return 0;
        return lhs.get("channel") < rhs.get("channel");
      }
    });
  
    return collection;
  });
  