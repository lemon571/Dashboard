define([
    "jquery",
    "underscore",
    "backbone",
    // Models
    "models/dashboard/firmware_information"
  ], function ($, _, Backbone, FiremwareInformationModel) {
    
    var collection = Backbone.Collection.extend({
      
      model: FiremwareInformationModel,
    });
  
      return collection;
  });
  