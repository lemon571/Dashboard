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
        el: '#button-pc',
        //template: template(QuiclButtonTemplate),

        initialize: function () {
          this.views = {};
        },

        afterRender: function() {
          this.$el.html(this.template());
          return this;
        },
        
        events: {
            'click select': 'stopPropagation',
            'click option': 'toggleCheckbox'
        },
        
        stopPropagation: function(e) {
            e.stopPropagation();
        },
        
        toggleCheckbox: function(e) {
            const $checkbox = $(e.target).prev();
            $checkbox.prop('checked', !$checkbox.prop('checked'));
        }
    });

    return view;
});
