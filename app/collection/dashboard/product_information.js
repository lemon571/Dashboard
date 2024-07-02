define([
  "jquery",
  "underscore",
  "backbone",
  // Models
  "models/dashboard/system_status",
], function ($, _, Backbone, ProductInformationModel) {
  var collection = Backbone.Collection.extend({
    model: ProductInformationModel,

    url: "/api/product-information",

        initialize: function () {
            this.fetch();
        }
    });

    return collection;
});
