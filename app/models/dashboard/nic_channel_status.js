define(["underscore", "backbone"], function (
    _,
    Backbone
  ) {
    const speed_duplex_str = [];
    speed_duplex_str[0] = "Auto-negotiate not complete";
    speed_duplex_str[1] = "10BASE-T half-duplex";
    speed_duplex_str[2] = "10BASE-T full-duplex";
    speed_duplex_str[3] = "100BASE-TX half-duplex";
    speed_duplex_str[4] = "100BASE-T4";
    speed_duplex_str[5] = "100BASE-TX full-duplex";
    speed_duplex_str[6] = "1000BASE-T half-duplex";
    speed_duplex_str[7] = "1000BASE-T full-duplex";
    speed_duplex_str[8] = "10G-BASE-T";
    speed_duplex_str[9] = "20 Gbps";
    speed_duplex_str[10] = "25 Gbps";
    speed_duplex_str[11] = "40 Gbps";
    speed_duplex_str[12] = "50 Gbps";
    speed_duplex_str[13] = "100 Gbps";
    speed_duplex_str[14] = "2.5 Gbps";
    speed_duplex_str[15] = "Not Supported";

    const link_str = [];
    link_str[0] = "DOWN";
    link_str[1] = "UP";

    var model = Backbone.Model.extend({
      defaults: {
        mac: "na",
        link: "na",
        channel: 0
      },
      
      MacAddr: function(){
        return this.get("mac")
      },
      State: function(){
        return link_str[this.get("link")]
      },
      ChannelId: function(){
        return "Channel " + Number(this.get("channel") + 1);
      }
      
    });
  
    return model;
  });
  