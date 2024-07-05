define([
  "jquery",
  "underscore",
  "backbone",
  "app",
  // Collection
  //"collection/dashboard/network_info",
  // Template HTML
  "text!templates/dashboard/network_information.html"
], function (
  $,
  _,
  Backbone,
  app,
  //NetworkInformationCollection,
  NetworkInformationTemplate
) {  
  var view = Backbone.View.extend({
    template: template(NetworkInformationTemplate),

    initialize: function () {
      this.views = {};
    },

    afterRender: function () {
      this.RequestComponentStatus(this);
    },

    RequestComponentStatus: function (that) {
      $.ajax({
        url: "api/dashboard-network",
        type: "GET"
      })
      .done(function(data) {
        that.$("#mac_address").html(data.mac_address);
        that.$("#ipv4_network_mode").html(data.ipv4_network_mode);
        that.$("#ipv4_address").html(data.ipv4_address);
        that.$("#ipv6_network_mode").html(data.ipv6_network_mode);
        that.$("#ipv6_address").html(data.ipv6_address);
      })
      .fail(function() {
        console.error("Error network_info");
      });
    },
  });

  return view;
});
