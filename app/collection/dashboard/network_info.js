define([
    "jquery",
    "underscore",
    "backbone",
    // Models
    "models/dashboard/network_info"
], function($, _, Backbone, NetworkInfoModel) {
    var collection = Backbone.Collection.extend({
        model: NetworkInfoModel
    });

    return collection;
});