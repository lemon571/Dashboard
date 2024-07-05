define(["underscore", "backbone"], function (
    _,
    Backbone
  ) {
    var model = Backbone.Model.extend({
      defaults: {
        bmc_firmware: "NA",          
	    bmc_build_date: "NA",          
	    bios_firmware: "NA",          
	    bios_build_date: "NA",          
	    cpld: "NA"
      },
  
      Bmc_firmware: function () {
        return this.get("bmc_firmware");
      },

      Bmc_build_date: function () {
        return this.get("bmc_build_date");
      },

      Bios_firmware: function () {
        return this.get("bios_firmware");
      },

      Bios_build_date: function () {
        return this.get("bios_build_date");
      },
  
      Cpld: function () {
        return this.get("cpld");
      },
    });

    return model;
  });
  