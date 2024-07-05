define([
    "jquery",
    "underscore",
    "backbone",
    // Locales
    "i18n!:dashboard",,
  ], function ($, _, Backbone, CommonStrings) {

    var view = Backbone.View.extend({
      tagName: "tr",
      
      initialize: function() {

      },

      
      Refresh: function(models)
      {
        this.collection.reset(models);
      },

      afterRender: function () {
        
      },
  });

  return view;
});
