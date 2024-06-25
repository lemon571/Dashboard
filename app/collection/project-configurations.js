define(['jquery', 'underscore', 'backbone',
		'models/project-configuration', 'features'
	],
	function ($, _, Backbone, ProjectConfigurationModel, features) {
		var FeatureCollection = Backbone.Collection.extend({
			model: ProjectConfigurationModel,
			isFeatureAvailable: function (feature) {
				return this.findWhere({
					"feature": feature
				});
			}
		});
		return new FeatureCollection(features);
	});