define(["jquery", "underscore", "backbone", "models//license"],

function($, _, Backbone, LicenseModel) {

    var collection = Backbone.Collection.extend({

        url: function() {
            return "/api/settings/licenses"
        },

        model: LicenseModel

    });

    return new collection();

});
