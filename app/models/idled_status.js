define(["jquery", "underscore", "backbone", "i18n!:common"],

function($, _, Backbone, locale) {

    var model = Backbone.Model.extend({

        defaults: {},

        validation: {

        },

        url: "/api/idled-status",

        idled: function(command, opts) {
        	var model = this;
        	var options = {
        		url: '/api/actions/idled',
        		type: 'POST',
                	contentType: 'application/json',
        		data: JSON.stringify({"idled_command": command})
        	};

        	_.extend(options, opts);

        	return (this.sync || Backbone.sync).call(this, null, this, options);
        }
    });

    return new model;

});
