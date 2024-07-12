define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "text!templates/dashboard/quick-button",
  ], function (
    $,
    _,
    Backbone,
    app,
    QuiclButtonTemplate
  ) {  
    var view  = Backbone.View.extend({
        el: '#button-hvm',
        //template: template(QuiclButtonTemplate),

        initialize: function () {
          this.views = {};
        },

        afterRender: function() {
          this.$el.html(this.template());
          return this;
        },
        
        events: {
            'click': 'changeColor'
        },
        
        changeColor: function() {
            this.$el.toggleClass('button-active');
        }
    });

    return view;
});
