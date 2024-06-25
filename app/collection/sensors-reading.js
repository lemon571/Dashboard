define(['underscore', 'backbone', 'models/sensor'],
    function(_, Backbone, SensorModel) {

        var collection = Backbone.Collection.extend({

            url: "/api/detail_sensors_readings",

            model: SensorModel,

            getSensor: function(sensor_number) {
                return this.find(function(model){
                    return model.get('sensor_number') == sensor_number;
                });
            },

            getDisabledSensors: function() {

                return new Backbone.Collection(this.where({
                    'accessible': 0xD5
                }));

            },

            getDiscreteSensors: function() {

                var results = this.filter(function(model) {
                    //
                    return (model.get('discrete_state') !== 0 && model.get('accessible') !== 0xD5);
                });

                //console.log(_.each(results, function(m){}));

                return new Backbone.Collection(results);

            },

            getCriticalSensors: function() {

                var criticalSensors = this.filter(function(model) {

                    if (model.get('accessible') == 0xD5) return false;

                    if (model.get('discrete_state') !== 0) return false;

                    if (model.get('sensor_state') != 1){
                        return true;
                    }else{
                        return false;
                    } 

                });

                return new Backbone.Collection(criticalSensors);

            },

            getNormalSensors: function() {
                var normalSensors = this.filter(function(model) {

                    if (model.get('accessible') == 0xD5) return false;

                    if (model.get('discrete_state') !== 0) return false;

                    if(model.get('sensor_state') == 1){
                        return true;
                    }else{
                         return false;
                    }
                });

                return new Backbone.Collection(normalSensors);
            }

        });

        return new collection();

    });