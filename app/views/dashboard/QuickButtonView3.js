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
        'click #pa': 'changeStatusPA',
        'click .one': 'toggleDropdown',
        //'click i': 'toggleCheckmark',
        'click .btn': 'toggleCheck',
        'click #dropdown-container': 'hideDropdown',

        
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
        if (this.$('#pc').hasClass('button-active')) {
          this.$('#pc').removeClass('button-active');
          this.$('#pc').addClass('button-inactive');

        } 
        else {
          this.$('#pc').removeClass('button-inactive');
          this.$('#pc').addClass('button-active');
       }
      },

      changeStatusPA: function(){
        if (this.$('#pa').hasClass('button-active')) {
          this.$('#pa').removeClass('button-active');
        } 
        else {
          this.$('#pa').addClass('button-active');
       }
      },

      toggleDropdown: function(){
        this.$('#dropdown-container').toggleClass('hidden');
      },

      //toggleCheckmark: function(){
        //this.$('.fa-check').toggle();
      //},

      toggleCheck: function(){
        if (this.$('.btn-circle').hasClass('btn-success')) {
          this.$('.btn-circle').removeClass('btn-success');
        } 
        else {
          this.$('.btn-circle').addClass('btn-success');
          //this.$('.fa-check').toggle();
       }
       this.$('.fa-check').toggle();
      },


      /*toggleDropdown: function(){
        this.$('#dropdown-container').toggleClass('hidden');
      },

      toggleCheck: function(){
        if (this.$('.btn-circle').hasClass('btn-success')) {
          this.$('.btn-circle').removeClass('btn-success');
        } 
        else {
          this.$('.btn-circle').addClass('btn-success');
       }
        this.$('.fa-check').toggle();
      },*/

      /*toggleCheckmark: function(event){
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
      },*/

      hideDropdown: function(e){
        var button = this.$('.one');
        var table = this.$('#dropdown-container');
        if (! button.is(e.target)  && ! table.is(e.target)){
          table.fadeOut();
        }
      },

    });
  
    return view;
  });
  