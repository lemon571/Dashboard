define([
    "jquery",
    "underscore",
    "backbone",
    "app",
    // Template HTML
    "text!templates/dashboard/template.html"
  ], function ($, _, Backbone, app, LaunchTasksTemplate) {
    var view = Backbone.View.extend({
      template: _.template(LaunchTasksTemplate),
  
      events: {
        "click .launch-tasks-button": "openNewPage"
      },
  
      initialize: function() {
        this.openNewPage = this.openNewPage.bind(this);
      },
  
      render: function() {
        this.$el.html(this.template());
        return this;
      },
  
      openNewPage: function(event) {
        var buttonId = $(event.currentTarget).attr("id");
        window.open(buttonId, "_blank");
      }
    });
  
    return view;
  });
  