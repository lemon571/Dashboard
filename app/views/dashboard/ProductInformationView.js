define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // View
    "views/dashboard/ProductInformationCollectionView",
    //"views/dashboard/RaidStatusView",
    //"views/dashboard/NicStatusView",
    // Collection
    "collection/dashboard/product_information",
    //"collection/dashboard/raid_controller_status",
    //"collection/dashboard/nic_status",
    // Locales
    "i18n!:dashboard",
    // Template HTML
    "text!templates/dashboard/product_information.html",
  ], function (
    $,
    _,
    Backbone,
    app,
    ProductInformationCollectionView,
    //RaidStatusView,
    //NicStatusView,
    ProductInformationCollection,
    //RaidControllerCollection,
    //NicCollection,
    //CommonStrings,
    ProductInformationTemplate
  ) {
  
    var view = Backbone.View.extend({
      tagName: "tr",

      template: template(ProductInformationTemplate),
      
      events: {
        "change": "render"
      },

      initialize: function () {
        this.view = {};
        this.view.model = this.model;
        this.view.model.on("change", this.render, this);
      },

      render: function () {
        this.$el.html(this.template({
          title: this.view.model.get("title"),
          value: this.view.model.get("value")
        }));
        return this;
      },
    });
  
    return view;
});