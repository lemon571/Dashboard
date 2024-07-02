define([
    "jquery",
    "underscore",
    "backbone",
    // Locales
    "i18n!:system_status",
  ], function ($, _, Backbone, CommonStrings) {

  var group_id = "#dashboard";
    
  var TemplateItem = function (item) {
    const TEMPLATE =
      '<tr class="toggle-' + item.group_id + ' system_table_item">\
        <td></td>\
        <td>' + item.component_id + '</td>\
        <td></td>\
      </tr>';
    
      return TEMPLATE;
  };

    var view = Backbone.View.extend({
        tagName: "tr",

        initialize: function ()
    {
      if(this.group_id == undefined)
      {
        this.group_id = "na";
      }
    },

    Refresh: function(models)
    {
      this.collection.reset(models);


      this.RefreshComponents();
    },

    afterRender: function () {
      this.$el.addClass("group-header-" + this.group_id);
      this.$el.addClass("dashboard-component-header");

      this.RenderComponents(true);
    },

    RenderComponents: function (has_hidden) {
      var header = this.$el;
      var group_id = this.group_id;

      this.collection.sort();

      _.each(this.collection.models, function (model) {
        

        var $tmpl = $(
          TemplateItem({
            group_id: group_id,
            component_id: model.Id(),
          })
        );

        $tmpl.insertAfter(header);
      });
    },

    RefreshComponents: function()
    {
      var $components = this.$el.parent().find("tr.toggle-" + this.group_id);
      $components.remove();

      this.RenderComponents(has_hidden);
    }
  });

  return view;
});