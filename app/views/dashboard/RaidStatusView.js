define([
  "jquery",
  "underscore",
  "backbone",
  // Locales
  "i18n!:system_status",
], function ($, _, Backbone, CommonStrings) {
  var GetLink = function (key) {
    const LINK = {
      info: "#settings/raid_management/raid_controller_info",
      pd_device: "#settings/raid_management/physical_device_info",
    };

    return LINK[key] || "#dashboard";
  };

  var TemplateHeader = function (header) {
    const TEMPLATE =
      '<td><i class="fa fa-sort-desc"></i></td>\
      <td>' +
      header.title +
      '</td>\
      <td>\
        <a href="' + header.link + '">\
          <i class="' + header.icon + '"></i> ' + header.status + "\
        </a>\
      </td>";

    return TEMPLATE;
  };

  var TemplateItem = function (item) {
    var hidden = item.hidden ? "hide" : "";
    const TEMPLATE =
      '<tr class="toggle-'+item.view_id+" system_table_item "+hidden+'">\
        <td><i class="'+item.smart+'"></i></td>\
        <td>'+item.component_id+'</td>\
        <td><a href="' + item.link + '">'+item.state+'</a></td></tr>';

    return TEMPLATE;
  };

  var CheckHealth = function (controller_health, fields) {
    var is_found = false;
    fields.forEach(function (field) {
      is_found |= (field in controller_health)&& (controller_health[field] > 0);
    });

    return is_found;
  };

  var view = Backbone.View.extend({
    tagName: "tr",

    initialize: function () {
      if (this.view_id == undefined) {
        this.view_id = "raid-na";
      }

      this.raid_status = "OK";
      this.raid_status_icon = "fa fa-check-circle text-green fa-lg";
    },

    Refresh: function (models, raid_health) {
      this.collection.reset(models);
      this.health = raid_health;

      this.RefreshComponents();
    },

    UpdateHealth: function (controller_health) {
      if (CheckHealth(controller_health, ["CtrlHealthStatus", "Status"])) {
        this.raid_status = "Controller Health";
        this.raid_status_icon = "fa fa-exclamation-triangle text-yellow fa-lg";
      } else if (CheckHealth(controller_health, [
          "PDPredFailCount",
          "PDFailedCount",
          "NVRAMUnCorrectableErrorCount",
        ])
      ) {
        this.raid_status = "Fail";
        this.raid_status_icon = "fa fa-times-circle text-red fa-lg";
      } else if (CheckHealth(controller_health, [
          "LDCriticalCount",
          "PDCriticalCount",
        ])
      ) {
        this.raid_status = "Critical";
        this.raid_status_icon = "fa fa-times-circle text-red fa-lg";
      } else if (CheckHealth(controller_health, [
          "LDWarningCount",
          "PDWarningCount",
          "BBU_packMissing",
          "BBU_voltageLow",
          "BBU_temperatureHigh",
        ])
      ) {
        this.raid_status = "Warning";
        this.raid_status_icon = "fa fa-exclamation-triangle text-yellow fa-lg";
      } else {
        this.raid_status = "OK";
        this.raid_status_icon = "fa fa-check-circle text-green fa-lg";
      }
      this.RefreshHeader();
    },

    afterRender: function () {
      this.$el.addClass("group-header-" + this.view_id);
      this.$el.addClass("dashboard-component-header");

      this.RenderHeader();
      this.RenderComponents(true);
    },

    RenderHeader: function () {
      var title = this.controller_name.trim();
      this.$el.append(
        TemplateHeader({
          title: title,
          status: this.raid_status,
          icon: this.raid_status_icon,
          link: GetLink("info"),
        })
      );

      var $icon_open = this.$el.find("td:nth-child(1) i.fa");
      var view_id = this.view_id;
      this.$el
        .find("td:nth-child(1),td:nth-child(2)")
        .on("click", function (e) {
          $("tr.toggle-" + view_id).toggleClass("hide");
          $icon_open.toggleClass("fa-sort-asc fa-sort-desc");
        });
    },

    RenderComponents: function (has_hidden) {
      var header = this.$el;
      var view_id = this.view_id;

      this.collection.sort();

      _.each(this.collection.models, function (model) {
        var $tmpl = $(
          TemplateItem({
            view_id: view_id,
            component_id: model.Title(),
            state: model.State(),
            smart: model.Smart(),
            hidden: has_hidden,
            link: GetLink("pd_device"),
          })
        );

        $tmpl.insertAfter(header);
      });
    },

    RefreshHeader: function () {
      var $status_td = this.$el.find("td:nth-child(3) a");
      $status_td.html(
        '<i class="' + this.raid_status_icon + '"></i> ' + this.raid_status
      );
    },

    RefreshComponents: function () {
      var $components = this.$el.parent().find("tr.toggle-" + this.view_id);
      var has_hidden = $components.hasClass("hide");
      $components.remove();

      this.RenderComponents(has_hidden);
    },
  });

  return view;
});
