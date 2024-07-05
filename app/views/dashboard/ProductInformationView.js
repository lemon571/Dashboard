define([
  "jquery",
  "underscore",
  "backbone",
  "app",
  // Collection
  "collection/dashboard/product_information",
  // Template HTML
  "text!templates/dashboard/product_information.html"
], function (
  $,
  _,
  Backbone,
  app,
  ProductInformationCollection,
  ProductInformationTemplate
) {  
  var view = Backbone.View.extend({
    template: template(ProductInformationTemplate),

    initialize: function () {
    },

    afterRender: function () {
      this.RequestComponentStatus(this);
    },

    RequestComponentStatus: function (that) {
      that.$("#vendor").html("s");
      that.$("#model_product").html("s0");
      that.$("#board_model").html("sd");
      that.$("#server_serial_number").html("sd");
      that.$("#host_name").html("sd");
      that.$("#uuid").html("sd");
    },
  });

  return view;
});