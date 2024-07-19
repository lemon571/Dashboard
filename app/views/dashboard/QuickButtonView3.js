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
        //'click .btn': 'toggleCheck',
        'click #bfp': 'toggleCheckBfp',
        'click #bpo': 'toggleCheckBpo',
        'click #bpc': 'toggleCheckBpc',
        'click #bfs':'toggleCheckBfs',
        'click #btn': "toggleCheckBtn",
        'click #bss': "toggleCheckBss",
        'click document':'hideDropdown',

        
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

      hideDropdown: function(){
        if (! this.$('#dropdown-container') && ! this.$('.one')){
          this.$('#dropdown-container').toggleClass('hidden');
        }
          //table.fadeOut();
        },
    

      //toggleCheckmark: function(){
        //this.$('.fa-check').toggle();
      //},

      /*toggleCheck: function(){
        if (this.$('.btn-circle').hasClass('btn-success')) {
          this.$('.btn-circle').removeClass('btn-success');
        } 
        else {
          this.$('.btn-circle').addClass('btn-success');
          //this.$('.fa-check').toggle();
       }
       this.$('.fa-check').toggle();
      },*/

      toggleCheckBfp: function(){
        if (this.$('#bfp').hasClass('btn-success')) {
          this.$('#bfp').removeClass('btn-success');
          this.$('#ffp').toggle();
        } 
        else {
          this.$('#bfp').addClass('btn-success');
          this.$('#ffp').toggle();
       }
      },

      toggleCheckBpo: function(){
        if (this.$('#bpo').hasClass('btn-success')) {
          this.$('#bpo').removeClass('btn-success');
          this.$('#fpo').toggle();
        } 
        else {
          this.$('#bpo').addClass('btn-success');
          this.$('#fpo').toggle();
       }
      },

      toggleCheckBpc:function(){
        if (this.$('#bpc').hasClass('btn-success')) {
          this.$('#bpc').removeClass('btn-success');
          this.$('#fpc').toggle();
        } 
        else {
          this.$('#bpc').addClass('btn-success');
          this.$('#fpc').toggle();
       }
      },

      toggleCheckBfs:function(){
        if (this.$('#bfs').hasClass('btn-success')) {
          this.$('#bfs').removeClass('btn-success');
          this.$('#ffs').toggle();
        } 
        else {
          this.$('#bfs').addClass('btn-success');
          this.$('#ffs').toggle();
       }
      },

      toggleCheckBtn:function(){
        if (this.$('#btn').hasClass('btn-success')) {
          this.$('#btn').removeClass('btn-success');
          this.$('#ftn').toggle();
        } 
        else {
          this.$('#btn').addClass('btn-success');
          this.$('#ftn').toggle();
       }
      },

      toggleCheckBss:function(){
        if (this.$('#bss').hasClass('btn-success')) {
          this.$('#bss').removeClass('btn-success');
          this.$('#fss').toggle();
        } 
        else {
          this.$('#bss').addClass('btn-success');
          this.$('#fss').toggle();
       }
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

    });
  
    return view;
  });
  