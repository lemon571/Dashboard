define([
  "jquery",
  "underscore",
  "backbone",
  // Locales
  "i18n!:system_status",
], function ($, _, Backbone, CommonStrings) {
  var GetLink = function (group_id) {
    const LINK = {
      psu: "#system_inventory_info/power",
      cpu: "#system_inventory_info/processor",
      memory: "#system_inventory_info/memory",
      baseboard: "#system_inventory_info/baseboard",
      network_interface: "#system_inventory_info/baseboard",
      fans: "#system_inventory_info/thermal",
      storage_drives: "#system_inventory_info/storage",
      storage_controller: "#system_inventory_info/storage",
      sensors: "#sensors"
    };

    return LINK[group_id] || "#dashboard";
  };

  var TemplateHeader = function (header) {
    const TEMPLATE =
     '<td><i class="fa fa-sort-desc" ></i></td>\
      <td>' + header.title +'</td>\
      <td>\
        <a href="' + header.link +'">\
          <i class="' + header.icon +'"></i> ' +header.status +"\
        </a>\
      </td>";

    return TEMPLATE;
  };

  var TemplateItem = function (item) {
    var hidden = (item.hidden) ? "hide" : "";
    const TEMPLATE =
      '<tr class="toggle-' + item.group_id + ' system_table_item ' + hidden + '">\
        <td></td>\
        <td>' + item.component_id + '</td>\
        <td><i class="' + item.icon + '"></i> ' + item.status +"</td>\
      </tr>";

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

      this.UpdateGroupStatus();
    },

    UpdateGroupStatus: function()
    {
      var bad_component = this.collection.FindBadComponent();
      if(bad_component == undefined)
      {
        this.group_status = "NA";
        this.group_status_icon = "fa fa-frown-o fa-lg";
      } else {
        this.group_status = bad_component.Status();
        this.group_status_icon = bad_component.StatusIcon(this.group_status);
      }
    },

    Refresh: function(models)
    {
      this.collection.reset(models);

      this.UpdateGroupStatus();
      this.RefreshHeader();
      this.RefreshComponents();
    },

    afterRender: function () {
      this.$el.addClass("group-header-" + this.group_id);
      this.$el.addClass("dashboard-component-header");

      this.RenderHeader();
      this.RenderComponents(true);
    },

    RenderHeader: function () {
      var group_id = this.group_id;
      this.$el.append(TemplateHeader({
          title: CommonStrings.t("system_status:" + group_id),
          status: this.group_status,
          icon: this.group_status_icon,
          link: GetLink(group_id),
        })
      );

      var $icon_open = this.$el.find("td:nth-child(1) i.fa");
      var that = this;
      this.$el
        .find("td:nth-child(1),td:nth-child(2)")
        .on("click", function (e) {
          $("tr.toggle-" + group_id).toggleClass("hide");
          $icon_open.toggleClass("fa-sort-asc fa-sort-desc");
        });
    },

    RenderComponents: function (has_hidden) {
      var header = this.$el;
      var group_id = this.group_id;

      this.collection.sort();

      _.each(this.collection.models, function (model) {
        if(model.IsNaState()) return;

        var $tmpl = $(
          TemplateItem({
            group_id: group_id,
            component_id: model.Id(),
            status: model.Status(),
            icon: model.StatusIcon(),
            hidden: has_hidden
          })
        );

        $tmpl.insertAfter(header);
      });
    },

    RefreshHeader: function()
    {
      var $status_td = this.$el.find("td:nth-child(3) a");
      $status_td.html('<i class="' + this.group_status_icon +'"></i> ' + this.group_status);
    },

    RefreshComponents: function()
    {
      var $components = this.$el.parent().find("tr.toggle-" + this.group_id);
      var has_hidden = $components.hasClass("hide");
      $components.remove();

      this.RenderComponents(has_hidden);
    }
  });

  return view;
});
