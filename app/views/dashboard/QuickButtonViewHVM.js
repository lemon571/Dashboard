define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "app/templates/dashboard/quick_button.html"
  ], function (
    $,
    _,
    Backbone,
    app,
    QuiclButtonTemplate
  ) {  
    var view  = Backbone.View.extend({
        el: '#hvm-button',
        template: template(QuiclButtonTemplate),

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
            this.$el.toggleClass('active');
        }
    });

    return view;
});
