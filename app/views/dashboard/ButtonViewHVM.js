define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "text!templates/dashboard/quick_button_hvm.html"
  ], function (
    $,
    _,
    Backbone,
    app,
    ButtonHVMTemplate
  ) {  
    var view = Backbone.View.extend({
      template: template(ButtonHVMTemplate),
  
      initialize: function () {
        this.views = {};
      },
  
      afterRender: function () {
        this.$el.html(this.template());
        return this;
      },

      events:{
        'click #hvm': 'changeStatusHVM'
      },
      changeStatusHVM: function(event) {
        this.$el.find("#hvm").toggleClass("button-active");
      }
    });
  
    return view;
  });
  