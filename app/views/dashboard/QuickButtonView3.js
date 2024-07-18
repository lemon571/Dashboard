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
        'click .one': 'toggleDropdown',
        'click i': 'toggleCheckmark',
       //'click table': 'hideDropdown',
      },

      changeStatusHVM: function(){
        if (this.$('#hvm').hasClass('button-active')) {
          this.$('#hvm').removeClass('button-active');
          this.$('#hvm').addClass('button-inactive');

        } 
        else {
          this.$('#hvm').removeClass('button-inactive');
          this.$('#hvm').addClass('button-active');
       }
      },

      changeStatusPC: function(){
        this.$('#pc').addClass('button-active');
      },

      toggleDropdown: function(){
        this.$('#dropdown-container').toggleClass('hidden');
      },

      toggleCheckmark: function(event){
        //var checkbuttonIcon = this.$(button).find('i');
        var button = this.$(event.currentTarget);
        var row = button.closest('tr');
        var checkIcon = button.find('i');
        if (row.hasClass('selected')) {
          button.removeClass('btn-success');
          checkIcon.removeClass('fa-check');
          row.removeClass('selected');
        } else {
          button.addClass('btn-success');
          checkIcon.addClass('fa-check');
          row.addClass('selected');
        }
      },

      hideDropdown: function(e){
        var block = $("table");
        if (!block.is(e.tsrget) && block.has(e.target).length === 0) {
          block.hide();
        }
      }

    });
  
    return view;
  });
  