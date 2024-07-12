define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    //"templates/dashboard/quick-button"
  ], function (
    $,
    _,
    Backbone,
    app,
    //QuiclButtonTemplate
  ) { 
    
    var view = Backbone.View.extend({
      el: '#button-pc', 
      //template: template(QuiclButtonTemplate),
  
      events: {
          'click #button-pc': 'toggleDropdown',
          'click #first-option': 'selectFirstOption',
          'click #second-option': 'selectSecondOption'
      },
  
      initialize: function() {
          this.buttonPC = this.$('#button-pc');
          this.dropdownContainer = this.$('#dropdown-container');
          //this.firstOption = this.$('#first-option');
          //this.secondOption = this.$('#second-option');
      },
  
      render: function() {
 },
  
      toggleButtonHVM: function() {
          this.buttonHVM.toggleClass('button-active');
      },
  
      toggleDropdown: function() {
          this.dropdownContainer.toggleClass('hidden');
          this.buttonPC.toggleClass('button-active');
      },
  
      //selectFirstOption: function() {
      //    console.log('First option selected');
      //},
  
      //selectSecondOption: function() {
      //    console.log('Second option selected');
      //},
  
      toggleCheckmark: function(button) {
          var checkIcon = button.find('i');
          if (!checkIcon.hasClass('fa-check')) {
              button.addClass('btn-success');
              checkIcon.addClass('fa-check');
          } else {
              button.removeClass('btn-success');
              checkIcon.removeClass('fa-check');
          }
      }
  });
  return view;

});





    /*
    var view = Backbone.View.extend({
      template: template(QuickButtonTemplate),
      events: {
        'click #button-pc': 'toggle',
        'click .btn btn-success btn-circle btn-sm': 'toggleCheckmark',
        'click #dropdown-container': 'toggleDropdown'
      },
      initialize: function(){
        this.views={};
      },
      render: function(){

      },
      toggleCheckmark: function(){
        var checkIcon = button.querySelector('i');
        //First - add
        if (!checkIcon.classList.contains('fa-check')) {
            button.classList.add('btn-success');
            checkIcon.classList.add('fa-check');
        } else {
            // Second - remove
            button.classList.remove('btn-success');
            checkIcon.classList.remove('fa-check');
        }
      },
      toggleDropdown: function(){
        var dropdown = document.getElementById('dropdown-container');
        dropdown.classList.toggle('hidden');
      },
    }); 
    return view;
  });*/
    


  

      
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
      
