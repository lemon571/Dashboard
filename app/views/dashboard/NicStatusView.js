define([
  "jquery",
  "underscore",
  "backbone",
  // Locales
  "i18n!:system_status",
], function ($, _, Backbone, CommonStrings) {
  var TemplateHeader = function (header) {
    const TEMPLATE =
      '<td><i class="fa fa-sort-desc"></i></td>\
      <td>' + header.title + '<br>'+header.index+'</td>\
      <td></td>';

    return TEMPLATE;
  };

  var TemplateItem = function (item) {
    var hidden = item.hidden ? "hide" : "";
    const TEMPLATE =
      '<tr class="toggle-'+item.view_id+" system_table_item "+hidden+'">\
        <td></td>\
        <td>'+item.channel_id+' MAC: '+item.mac+'</td>\
        <td><a href="#settings/nic_management/nic_controller_info">'+item.state+'</a></td></tr>';

    return TEMPLATE;
  };

  var view = Backbone.View.extend({
    tagName: "tr",

    initialize: function () {
    },

    Refresh: function (models) {
      this.collection.reset(models);

      this.RefreshComponents();
    },


    afterRender: function () {
      this.$el.addClass("group-header-" + this.view_id);
      this.$el.addClass("dashboard-component-header");

      this.RenderHeader();
      this.RenderComponents(true);
    },

    RenderHeader: function () {
      var title = this.controller_name.trim();
      var vendor_id = "0x" + this.vendor_id.toString(16).toUpperCase();
      var device_id = "0x" + this.device_id.toString(16).toUpperCase();
      var idx = "("+vendor_id+","+device_id+","+this.eid+")";
      
      this.$el.append(
        TemplateHeader({
          title: title,
          index: idx
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
      _.each(this.collection.models, function (channel) {
        var $tmpl = $(
          TemplateItem({
            view_id: view_id,
            mac: channel.MacAddr(),
            state: channel.State(),
            channel_id: channel.ChannelId(),
            hidden: has_hidden
          })
        );

        $tmpl.insertAfter(header);
      });
    },

    RefreshHeader: function () {
    //   var $status_td = this.$el.find("td:nth-child(3) a");
    //   $status_td.html(
    //     '<i class="' + this.raid_status_icon + '"></i> ' + this.raid_status
    //   );
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
