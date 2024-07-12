define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "/home/user/work/webui-light/app/templates/dashboard/quick_button.html"
  ], function (
    $,
    _,
    Backbone,
    app,
    //QuiclButtonTemplate
  ) {  
    var view = Backbone.View.extend({
      template: template(QuickButtonTemplate),
      events: {
        'click #button-hvm"': 'toggle'
      },
      initialize: function(){
        this.views={};
      },
      render: function(){

      },
    }); 
    return view;
  });
    


  

      
      /*
        var view = Backbone.View.extend({
            el: '#powerControl',
            events: {
                'click #hvmButton': 'toggleHvmButtonColor',
                'change #powerSelect': 'updatePowerSelect'
            },
            initialize: function() {
                this.model = new PowerControlModel();
                this.render();
            },
            render: function() {
                this.$el.find('#hvmButton').addClass(this.model.get('hvmButtonColor') + 'Button');
                return this;
            },
            toggleHvmButtonColor: function() {
                this.model.set('hvmButtonColor', 'green');
                this.render();
            },
            updatePowerSelect: function() {
                this.$el.find('#powerSelect option').each(function() {
                    if ($(this).prop('selected')) {
                        $(this).addClass('selected');
                    } else {
                        $(this).removeClass('selected');
                    }
                });
            }*/

    /*
        afterRender: function () {
          this.RequestComponentStatus(this);
        },
    
        RequestComponentStatus: function (that) {
          $.ajax({
            url: "api/dashboard-product",
            type: "GET"
          })
          .done(function(data) {
            that.$("#vendor").html(data.vendor);
            that.$("#model_product").html(data.model);
            that.$("#board_model").html(data.board_model);
            that.$("#server_serial_number").html(data.server_serial_number);
            that.$("#host_name").html(data.host_name);
            that.$("#uuid").html(data.uuid);
          })
          .fail(function() {
            console.error("Error product_information");
          });
        },*/
      
