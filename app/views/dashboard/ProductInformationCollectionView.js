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
        if(this.group_id == undefined)
          {
            this.group_id = "na";
          }
    
          this.UpdateGroupStatus();
      },
      
      
      Refresh: function(models)
      {
        this.collection.reset(models);
      },
  });

  return view;
});
