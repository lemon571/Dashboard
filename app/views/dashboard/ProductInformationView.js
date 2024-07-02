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
    "i18n!:system_status",
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
      template: template(ProductInformationTemplate),
  
      initialize: function () {
          this.views = {};
      },

      afterRender: function () {
        var $tbody = this.$("tbody");
        $tbody.html("");
        this.RequestComponentStatus($tbody, this);
      },

      RequestComponentStatus: function ($tbody, that) {
        $.ajax({
          url: "/api/dashboard-product",
          type: "GET",
          contentType: "application/json",
          success: function (data, status, xhr) {
            $.each(data, function (group, group_models) {
              if (group_models.length == 0) {
                return;
              }
  
              var collection = new ProductInformationCollectionView(group_models);
  
              var view = new ProductInformationCollectionView({
                collection: collection,
                group_id: group,
              });
  
              that.views[group] = view;
  
              that.RenderComponentsGroup(view, $tbody);
            });
          },
        });
      },
      
      RenderComponentsGroup: function (view, $tbody) {
        $tbody.append(view.$el);
        view.render();
      },
    });
  
    return view;
  });