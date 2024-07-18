define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "text!templates/dashboard/quick_button_pc.html"
  ], function (
    $,
    _,
    Backbone,
    app,
    ButtonPCTemplate
  ) {  
    var view = Backbone.View.extend({
      template: template(ButtonPCTemplate),
  
      initialize: function () {
        this.views = {};
      },
  
      afterRender: function () {
        this.$el.html(this.template());
        return this;
      },

      events:{
        "click #button-pc": "toggleDropdown",
        "click .dropdown-content .checkbox-container": "toggleCheckmark",
        "click document": "closeDropdown"
      },
      toggleDropdown: function(event) {
        event.stopPropagation();
        this.$el.find(".dropdown-content").toggleClass("show");
        this.$el.find("#button-pc").toggleClass("button-active");
      },
  
      toggleCheckmark: function(event) {
        var $checkbox = $(event.currentTarget).find("input[type='checkbox']");
        var $checkmarkCircle = $(event.currentTarget).find(".checkbox-circle");
  
        $checkbox.prop("checked", !$checkbox.prop("checked"));
        $checkmarkCircle.toggleClass("checked");
      },
  
      closeDropdown: function() {
        this.$el.find(".dropdown-content").removeClass("show");
        this.$el.find("#button-pc").removeClass("button-active");
      }
    });
  
    return view;
  });
  