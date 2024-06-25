define(["jquery", "underscore", "backbone", "app", "aq_utils", "i18n!:license_add"],

function($, _, Backbone, app, aq_utils, locale) {

    var model = Backbone.Model.extend({

        defaults: {},

        validation: {
            license_key: {
                fn: function(value, attr, computedState) {
                    if ((value.toString().length < 8)) {
                        return true;
                    } else {
                        return false;
                    }
                },
                msg: function() {
                    return locale.t('license_add:the_length_of_license_key_is_invalid_refer_help_for_more_information')
                }
            }
        },

        url: function() {
            return "/api/settings/license"
        }
    });

    return new model();

});
