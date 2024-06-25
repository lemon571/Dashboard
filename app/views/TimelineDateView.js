define([
    "jquery",
    "underscore",
    "backbone",

    "i18n!:common",
    //template
    'text!templates/timeline-date.html',
    "moment"
], function($, _, Backbone, CommonStrings, TLDTemplate, moment) {

    var view = Backbone.View.extend({

        tagName: "li",

        template: template(TLDTemplate),

        initialize: function() {

        },

        events: {

        },

        beforeRender: function() {
            this.$el.addClass("time-label"); // animated fadeInDown
        },

        afterRender: function() {
            this.$(".timeline_date").html(this.date);
        },

        serialize: function() {
            return {
                locale: CommonStrings
            };
        }

    });

    return view;

});