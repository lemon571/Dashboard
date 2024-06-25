define(["underscore", "backbone", "i18n!:physical_device_info"], function (
  _,
  Backbone,
  locale
) {

  const PD_STATE = {
    0: 'unconfigured_good',
    1: 'unconfigured_bad',
    3: 'offline',
    4: 'failed',
    5: 'rebuild',
    6: 'online',
    7: 'copyback',
    8: 'jbod',
    9: 'shield_unconfigured',
    10: 'shield_hot_spare',
    11: 'shield_configured'
  };

  var GetSmartIcon = function(smart) {
    const SMART_ICON = {
      1: "fa fa-circle text-red",
      2: "fa fa-circle text-green"
    }

    return SMART_ICON[smart] || "fa fa-circle text-gray";
  };

  var model = Backbone.Model.extend({
    defaults: {
      dev_id: 0,
      smart: 0,
      state: 0,
      vendor_id: "na",
      product_id: "na",
      serial_num: "na",
    },

    Id: function () {
      return this.get("dev_id");
    },

    Title: function () {
      return (
        this.get("vendor_id").trim() +
        " - " +
        this.get("product_id").trim() +
        " (S/N: " +
        this.get("serial_num").trim() +
        ")"
      );
    },

    Smart: function () {
      return GetSmartIcon(this.get("smart"));
    },

    State: function() {
      var state = Number( this.get('state'));
      var pd_type = Number(this.get('pd_type'));
      var state_key = 'NA';

      if( state in PD_STATE)
      {
        state_key = PD_STATE[state];
      } else if (state == 2 && pd_type & (1 << 2))
      {
        state_key = "global_hot_spare"
      }else if (state == 2 && pd_type & (1 << 3))
      {
        state_key = "dedicated_hot_spare"
      }

      return locale.t("physical_device_info:" + state_key);
    }
  });

  return model;
});
