//Model
var ProductInformationModel = Backbone.Model.extend({
    defaults: {
      vendor: '',
      model: '',
      board_model: '',
      server_serial_number: '',
      host_name: '',
      uuid: ''
    }
  });

//View
var ProductInformationView = Backbone.View.extend({
    el: '#table-product-information',
    template: _.template(`
      <h2>Product Information</h2>
      <table class="table table-body">
        <tbody>
          <tr>
            <td class="title">Vendor:</td>
            <td id="vendor" class="value"></td>
          </tr>
          <tr>
            <td class="title">Model:</td>
            <td id="model" class="value"></td>
          </tr>
          <tr>
            <td class="title">Board Model:</td>
            <td id="board_model" class="value"></td>
          </tr>
          <tr>
            <td class="title">Server Serial Number:</td>
            <td id="server_serial_number" class="value"></td>
          </tr>
          <tr>
            <td class="title">Host Name:</td>
            <td id="host_name" class="value"></td>
          </tr>
          <tr>
            <td class="title">UUID:</td>
            <td id="uuid" class="value"></td>
          </tr>
        </tbody>
      </table>
    `),
  
    initialize: function() {
      this.model = new ProductInformationModel();
      this.render();
    },
  
    render: function() {
      this.$el.html(this.template());
      this.updateValues();
      return this;
    },
  
    updateValues: function() {
      this.$('#vendor').text(this.model.get('vendor'));
      this.$('#model').text(this.model.get('model'));
      this.$('#board_model').text(this.model.get('board_model'));
      this.$('#server_serial_number').text(this.model.get('server_serial_number'));
      this.$('#host_name').text(this.model.get('host_name'));
      this.$('#uuid').text(this.model.get('uuid'));
    }
  });
 
 //AJAX
 $(document).ready(function() {
    var productInformationView = new ProductInformationView();
  
    $.ajax({
      url: 'dashboard.json',
      dataType: 'json',
      success: function(data) {
        productInformationView.model.set(data);
        productInformationView.updateValues();
      }
    });
  });
   