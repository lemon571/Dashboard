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
        this.views = {};
      },
  
      afterRender: function () {
        this.RequestComponentStatus(this);
      },
  
      RequestComponentStatus: function (that) {
        $.ajax({
          url: "api/dashboard-product",
          type: "GET"
        })
        .done(function(data) {
          that.$("#vendor").html(data.vendor);
          that.$("#model_product").html(data.model);
          that.$("#board_model").html(data.board_model);
          that.$("#server_serial_number").html(data.server_serial_number);
          that.$("#host_name").html(data.host_name);
          that.$("#uuid").html(data.uuid);
        })
        .fail(function() {
          console.error("Error product_information");
        });
      },
    });
  
    return view;
  });
  