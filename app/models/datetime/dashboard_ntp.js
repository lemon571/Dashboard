define(["jquery", "underscore", "backbone", "app", "i18n!:date_time"],

function($, _, Backbone, app, locale) {

    var model = Backbone.Model.extend({

        defaults: {},

        validation: {},

        url: function() {
            return "/api/settings/dashboardntp"
        }
        
    });

    return new model();

});
