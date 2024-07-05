define([
  "jquery",
  "underscore",
  "backbone",
  // Models
  "models/dashboard/product_information"
], function ($, _, Backbone, ProductInformationModel) {
  
  var collection = Backbone.Collection.extend({
    
    model: ProductInformationModel,
  });

    return collection;
});
