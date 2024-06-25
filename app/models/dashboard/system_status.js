define(["underscore", "backbone", "i18n!:system_status"], function (
  _,
  Backbone,
  CommonStrings
) {
  var model = Backbone.Model.extend({
    defaults: {
      id: "NA",
      state: "NA",
      health: "NA",
    },

    Id: function () {
      return this.get("id");
    },

    HaveHealth: function () {
      return (
        this.get("health") != undefined &&
        this.get("health").length != 0 &&
        this.get("health").toLowerCase() != "na"
      );
    },

    Health: function () {
      return this.get("health");
    },

    State: function () {
      return this.get("state");
    },

    Status: function () {
      if (this.HaveHealth()) {
        return this.Health();
      }

      return this.State();
    },

    IsNaState: function () {
      return (
        this.Health().toLowerCase() == "na" &&
        this.State().toLowerCase() == "na"
      );
    },

    StatusLevel: function () {
      const HEALTH = { critical: 1, warning: 2, ok: 3, na: 1000 };
      const STATE = {
        deferring: 10,
        disabled: 20,
        enabled: 30,
        intest: 40,
        quiesced: 50,
        standbyoffline: 60,
        standbyspare: 70,
        starting: 80,
        unavailableoffline: 90,
        updating: 100,
        absent: 200,
        na: 1000,
      };
      // 0 - NA
      return (
        Number(HEALTH[this.get("health").toLowerCase()] || 1000) +
        Number(STATE[this.get("state").toLowerCase()] || 1000)
      );
    },

    StatusIcon: function (status) {
      if (status == undefined) {
        status = this.Status();
      }

      const ICONS = {
        enabled: "fa fa-check-circle text-green fa-lg",
        disabled: "fa fa fa-circle-o text-red fa-lg",
        ok: "fa fa-check-circle text-green fa-lg",
        info: "fa fa-info-circle fa-lg",
        warning: "fa fa-exclamation-triangle text-yellow fa-lg",
        critical: "fa fa-times-circle text-red fa-lg",
        absent: "fa fa-ban fa-lg",
        na: "fa fa-ban fa-lg",
      };

      return ICONS[status.toLowerCase()] || "fa fa-times-circle text-red fa-lg";
    },
  });

  return model;
});
