define(["underscore", "backbone"], function (
    _,
    Backbone
  ) {
    var model = Backbone.Model.extend({
      defaults: {
        vendor: "NA",
        model: "NA",
        board_model: "NA",
        server_serial_number: "NA",
        host_name: "NA",
        uuid: "NA"
      },
  
      Vendor: function () {
        return this.get("vendor");
      },

      Model: function () {
        return this.get("model");
      },

      BoardModel: function () {
        return this.get("board_model");
      },

      ServerSerialNumber: function () {
        return this.get("server_serial_number");
      },
  
      HostName: function () {
        return this.get("host_name");
      },

      Uuid: function () {
        return this.get("uuid");
      },
    });

    return model;
  });
  