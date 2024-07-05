define(["underscore", "backbone"], function(_, Backbone) {
    var model = Backbone.Model.extend({
        defaults: {
            mac_address: "NA",
            ipv4_network_mode: "NA",
            ipv4_address: "NA",
            ipv6_network_mode: "NA",
            ipv6_address: "NA"
        },
  
        MAC_Address: function() {
            return this.get("mac_address");
        },
  
        IPv4_Network_Mode: function() {
            return this.get("ipv4_network_mode");
        },
  
        IPv4_Address: function() {
            return this.get("ipv4_address");
        },
  
        IPv6_Network_Mode: function() {
            return this.get("ipv6_network_mode");
        },
  
        IPv6_Address: function() {
            return this.get("ipv6_address");
        }
    });
  
    return model;
  });