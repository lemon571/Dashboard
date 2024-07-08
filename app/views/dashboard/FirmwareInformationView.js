define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Collection
    "collection/dashboard/firmware_information",
    // Template HTML
    "text!templates/dashboard/firmware_information.html"
],function(
    $,
    _,
    Backbone,
    app,
    FiremwareInformationTemplate
  ) {  
    var view = Backbone.View.extend({
      template: template(FiremwareInformationTemplate),
  
      initialize: function () {
        this.views = {};
      },
  
      afterRender: function () {
        this.RequestComponentStatus(this);
      },
  
      RequestComponentStatus: function (that) {
        $.ajax({
          url: "api/dashboard-firmware",
          type: "GET"
        })
        .done(function(data) {
          that.$("#bmc_firmware").html(data.bmc_firmware);
          that.$("#bmc_build_date").html(data.bmc_build_date);
          that.$("#bios_firmware").html(data.bios_firmware);
          that.$("#bios_build_date").html(data.bios_build_date);
          that.$("#cpld").html(data.cpld);
        })
        .fail(function() {
          console.error("Error firmware_information");
        });
      },
    });
  
    return view;
  });
  