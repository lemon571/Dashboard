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
  
    /* 
        initialize: function() {
            this.collection = new ProductInformationCollection();
            this.listenTo(this.collection, 'sync', this.render);
            this.fetchData();
    },
    */

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

                if (group in that.views) {
                    that.views[group].Refresh(group_models);

                    return;
                }

                var collection = new ProductInformationCollection(group_models);

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