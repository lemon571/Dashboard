define(["jquery", "underscore", "backbone", "app", "aq_utils", "i18n!:view_license"],

function($, _, Backbone, app, aq_utils, locale) {

    var model = Backbone.Model.extend({

        defaults: {},

        validation: {

        }
    });

    return model;

});
