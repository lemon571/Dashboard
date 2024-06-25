define([
  "jquery",
  "underscore",
  "backbone",
  "app",
  // View
  "views/dashboard/SystemStatusCollectionView",
  "views/dashboard/RaidStatusView",
  "views/dashboard/NicStatusView",
  // Collection
  "collection/dashboard/system_status",
  "collection/dashboard/raid_controller_status",
  "collection/dashboard/nic_status",
  // Locales
  "i18n!:system_status",
  // Template HTML
  "text!templates/dashboard/system_status.html",
], function (
  $,
  _,
  Backbone,
  app,
  SystemStatusCollectionView,
  RaidStatusView,
  NicStatusView,
  SystemStatusCollection,
  RaidControllerCollection,
  NicCollection,
  CommonStrings,
  SystemStatusTemplate
) {
  SensorsStatus = function (status) {
    const statusTitles = {
      0: "OK",
      1: "Warning",
    };
    return statusTitles[status] || "Critical";
  };

  if (
    app.dahsboard_system_status_interval_id != undefined &&
    app.dahsboard_system_status_interval_id != null
  ) {
    clearInterval(app.dahsboard_system_status_interval_id);
  }
  app.dahsboard_system_status_interval_id = null;
  app.dashboard_raid_controller_count = null;

  var view = Backbone.View.extend({
    template: template(SystemStatusTemplate),

    initialize: function () {
      this.views = {};
    },

    afterRender: function () {
      var $tbody = this.$("tbody");
      $tbody.html("");
      this.RequestComponentStatus($tbody, this);

      if (app.dahsboard_system_status_interval_id == null) {
        app.dahsboard_system_status_interval_id = setInterval(
          this.RequestComponentStatus,
          30000,
          this.$("tbody"),
          this
        );
      }
    },

    RequestComponentStatus: function ($tbody, that) {
      $.ajax({
        url: "/api/dashboard-status",
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

            var collection = new SystemStatusCollection(group_models);

            var view = new SystemStatusCollectionView({
              collection: collection,
              group_id: group,
            });

            that.views[group] = view;

            that.RenderComponentsGroup(view, $tbody);
          });

          that.RequestHealthStatus();
          that.RequestSensorsStatus();
          that.RequestRaidStatus();
          that.RequestNicStatus();
        },
      });
    },

    RequestHealthStatus: function () {
      $.ajax({
        url: "/api/dashboard-status-fault",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
          $.each(data, function (group, status) {
            if (status) {
              var status_link = $("tr.group-header-" + group).find("a");
              if (status_link.length) {
                status_link.html(
                  "<i class='fa fa-exclamation-triangle text-yellow fa-lg'></i> " +
                    CommonStrings.t("system_status:health_fault")
                );
              }
            }
          });
        },
      });
    },

    RequestSensorsStatus: function () {
      var that = this;
      var $tbody = that.$("tbody");
      $.ajax({
        url: "/api/dashboard-sensors-health-status",
        type: "GET",
        contentType: "application/json",
        success: function (sensors) {
          var sensors_collection = _.map(sensors, function (status, sensor) {
            return {
              id: CommonStrings.t("system_status:sensors_" + sensor),
              state: "enabled",
              health: SensorsStatus(status),
            };
          });

          if (sensors_collection.length == 0) {
            return;
          }

          if ("sensors" in that.views) {
            that.views["sensors"].Refresh(sensors_collection);

            return;
          }

          var collection = new SystemStatusCollection(sensors_collection);
          var view = new SystemStatusCollectionView({
            collection: collection,
            group_id: "sensors",
          });

          that.views["sensors"] = view;

          that.RenderComponentsGroup(view, $tbody);
        },
      });
    },

    RequestRaidStatus: function () {
      var that = this;

      if (
        app.dashboard_raid_controller_count != null &&
        app.dashboard_raid_controller_count == 0
      ) {
        // No raid controllers were found during the previous request
        return;
      }

      $.ajax({
        url: "/api/settings/raid_management/raid_controller_info",
        type: "GET",
        success: function (raid_controller_info) {
          app.raid_controller_info = Array.isArray(raid_controller_info)
            ? raid_controller_info.length
            : 0;
          if (app.raid_controller_info == 0) return;
          //Getting list of physical device for given raid controller
          $.each(raid_controller_info, function (idx, info) {
            var view_id = "raid_" + String(info.controller_id);
            that.UpdatePhysicalDevice(view_id, info);
          });
        },
        error: function () {
          app.dashboard_raid_controller_count = 0;
        },
      });
    },
    UpdatePhysicalDevice: function(raid_view_id, controller_info) {
      var that = this;
      var $tbody = that.$("tbody");
      $.ajax({
        url:
          "/api/settings/raid_management/physical_device_info?vendor_type=" +
          String(controller_info.vendor_type),
        type: "GET",
        success: function (physical_devices) {
          that.UpdateRaidControllerHealth(raid_view_id, controller_info);
          if (!Array.isArray(physical_devices) || physical_devices.length == 0) return;

          // Updating view or creating new
          if (raid_view_id in that.views) {
            that.views[raid_view_id].Refresh(physical_devices, controller_info.health);
            return;
          }

          var view = new RaidStatusView({
            collection: new RaidControllerCollection(physical_devices),
            controller_id: controller_info.controller_id,
            controller_name: controller_info.controller_name,
            health: controller_info.health,
            view_id: raid_view_id,
          });
          that.views[raid_view_id] = view;
          that.RenderComponentsGroup(view, $tbody);
        },
      });
    },
    UpdateRaidControllerHealth: function(raid_view_id, controller_info) {
      var that = this;
      $.ajax({
        url: "/api/dashboard-raid-health-status?vendor_type=" + String(controller_info.vendor_type) + "&controller_id=" + String(controller_info.controller_id),
        type: "GET",
        success: function(controller_health){
          if (raid_view_id in that.views) {
            that.views[raid_view_id].UpdateHealth(controller_health);
          }
        }
      })
    },

    RequestNicStatus: function(){
      var that = this;
      var $tbody = that.$("tbody");

      $.ajax({
        url: "/api/dashboard-nic-status",
        type: "GET",
        success: function(nic_status){
            $.each(nic_status, function(idx, nic){
                var nic_view_id ="nic_" +  String(nic.eid);
                // Updating view or creating new
                if (nic_view_id in that.views) {
                    that.views[nic_view_id].Refresh(nic.channels);
                    return;
                }
                var view = new NicStatusView({
                collection: new NicCollection(nic.channels),
                    controller_name: nic.name,
                    vendor_id: nic.vendor_id,
                    device_id: nic.device_id,
                    eid: nic.eid,
                    view_id: nic_view_id,
                });

                that.views[nic_view_id] = view;
                that.RenderComponentsGroup(view, $tbody);
            });
 
        }
      })
    },

    RenderComponentsGroup: function (view, $tbody) {
      $tbody.append(view.$el);
      view.render();
    },
  });

  return view;
});
