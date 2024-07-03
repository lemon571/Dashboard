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
    // Model
    "models/dashboard/product_information"
    
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
    ProductInformationTemplate,
    ProductInformationModel
  ) {
  
    var view = Backbone.View.extend({
      el: "#table-product-information tbody",

      initialize: function () {

        this.model = new ProductInformationModel();
        
        this.listenTo(this.model, 'change', this.render);
        this.model.fetchData();
    },

    render: function() {
      var data = this.model.toJSON();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          this.$('#' + key).text(data[key]);
        }
      }

      return this;
    },

    fetchData: function () {
      $.ajax({
        url: "api/dashboard-product",
        type: "GET",
        success: function (data) {
          this.collection.reset(
            _.map(data, function (item) {
              return { 
                title: item.title, 
                value: item.value 
              };
            })
          );
          this.render();
        }.bind(this)
      });
    }
  });
  
    return view;
});