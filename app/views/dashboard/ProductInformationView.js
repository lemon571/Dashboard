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
    //"collection/dashboard/product_information",
    //"collection/dashboard/raid_controller_status",
    //"collection/dashboard/nic_status",
    // Locales
    //"i18n!:product_information",
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
    //ProductInformationCollection,
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
  ///
      RequestComponentStatus: function ($tbody, that) {
        $.ajax({
          url: "/api/dashboard-product",
          type: "GET",
          contentType: "application/json",
          success: function (data, status, xhr) {
            $.each(data, function (group, group_models) {
  
              var collection = new ProductInformationCollectionView(group_models);
  
              var view = new ProductInformationCollectionView({
                collection: collection,
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
  
      /*
      renderData: function(data, $tbody) {
      this.model.set({
        vendor: data.vendor,
        model: data.model,
        board_model: data.board_model,
        server_serial_number: data.server_serial_number,
        host_name: data.host_name,
        uuid: data.uuid
      });
      this.render();
      $tbody.append(this.$el);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
     */