define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Collection
    "collection/dashboard/network_info",
    // Template HTML
    "text!templates/dashboard/network_info.html"
  ], function (
    $,
    _,
    Backbone,
    app,
    NetworkInformationCollection,
    NetworkInformationTemplate
  ) {  
    var view = Backbone.View.extend({
      template: template(NetworkInformationTemplate),
  
      initialize: function () {
      },
  
      afterRender: function () {
        this.RequestComponentStatus(this);
      },
  
      RequestComponentStatus: function (that) {
        that.$("#mac_address").html("s");
        that.$("#ipv4_network_mode").html("s0");
        that.$("#ipv4_address").html("sd");
        that.$("#ipv6_network_mode").html("sd");
        that.$("#ipv6_address").html("sd");
      },
    });

    return view;
});