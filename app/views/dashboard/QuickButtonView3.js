define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "text!templates/dashboard/quick-button3.html"
  ], function (
    $,
    _,
    Backbone,
    app,
    QuickButtonTemplate
  ) {  
    var view = Backbone.View.extend({
      template: template(QuickButtonTemplate),
  
      initialize: function () {
        this.views = {};
      },
  
      afterRender: function () {
      },

      events:{
        'click #hvm': 'changeStatusHVM',
        'click #pc': 'changeStatusPC',
        'click #dropdown-container': 'toggleDropdown',
        'click i': 'toggleCheckmark',
      },

      changeStatusHVM: function(){
        this.$('#hvm').addClass('button-active');
      },

      changeStatusPC: function(){
        this.$('#pc').addClass('button-active');
      },

      toggleDropdown: function(){
        this.$('#dropdown-container').toggleClass('button-hidden');
      },

      toggleCheckmark: function(event){
        //var checkbuttonIcon = this.$(button).find('i');
        var button = this.$(event.currentTarget);
        var checkIcon = button.find('i');
          if (!checkIcon.hasClass('fa-check')) {
              button.addClass('btn-success');
              checkIcon.addClass('fa-check');
          } else {
              button.removeClass('btn-success');
              checkIcon.removeClass('fa-check');
          }
      },

  
    });
  
    return view;
  });
  