define([
    "jquery",
    "underscore",
    "backbone",
    // Locales
    "i18n!:dashboard",,
  ], function ($, _, Backbone, CommonStrings) {

    var view = Backbone.View.extend({
      el: '#table-product-information',

      //model: ProductInformationModel,
      initialize: function() {
        this.collection = new ProductInformationCollection();
        this.collection.fetch();
        this.render();
      },
      
      render: function() {

        this.collection.each(function(model) {
        var view = new ModelView({ 
          model: model 
        });
        view.render();
      });
      
      return this;
    }
  });

  return view;
});