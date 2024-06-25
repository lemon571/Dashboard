define(['underscore', 'backbone', 'models/sensor'],
    function(_, Backbone, SensorModel) {

        var collection = Backbone.Collection.extend({

            url: "/api/dashboardsensors",

            model: SensorModel,

            getSensor: function(sensor_number) {
                return this.find(function(model){
                    return model.get('sensor_number') == sensor_number;
                });
            },

            getCriticalSensors: function() {
                var criticalSensors = this.filter(function(model) {
                    if (model.has("owner_id")){
                        return true;
                    }else{
                        return false;
                    } 
                });

                return new Backbone.Collection(criticalSensors);
            }
        });

        return new collection();

    });
