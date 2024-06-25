define([
    'jquery', 'underscore', 'backbone',
    'models/log'
],
    function ($, _, Backbone, EventLogModel) {

        var collection = Backbone.Collection.extend({

            url: "/api/logs/event",

            model: EventLogModel,

            comparator: function (model) { return (Math.floor(new Date().getTime() / 1000) - model.get('timestamp') - model.get('id')); },

            byDateRange: function (start, end) {

                if (!end) {
                    end = Math.floor(new Date().getTime() / 1000);
                }

                //make end date till midnight
                end = end + 86399; //one day seconds count

                var filtered = this.filter(function (model) {
                    var timestamp = parseInt(model.get("timestamp"), 10);
                    return (timestamp >= start && timestamp <= end);
                });

                return new collection(filtered);

            },

            bySensor: function (sensor_id, limit) {

                var filtered = this.filter(function (model) {
                    var sid = parseInt(model.get("sensor_number"), 10);
                    if (sid == sensor_id)
                        return (sid == sensor_id);
                });

                /*if(limit) {
                    filtered = filtered.slice(0,limit);
                }*/

                return new collection(filtered);
            },
            bySensorandLun: function (sensor_id, lun_num, limit) {
                var filtered = this.filter(function (model) {
                    var sid = parseInt(model.get("sensor_number"), 10);
                    var lid = parseInt(model.get("ipmb_lun"), 10);
                    if (sid == sensor_id && lid == lun_num)
                        return (sid == sensor_id && lid == lun_num);
                });
                return new collection(filtered);
            },
            bySeverity: function (severity) {
                return new collection(this.filter(function (model) {
                  return model.TestSeverity(severity);
                }));
            },


            byEventtype: function (event_type) {
                var filtered = this.filter(function (model) {
                    var recordType = model.get("record_type");
                    var systemSoftwareType = model.get("system_software_type");
                    var generatorType = model.get("generator_type");
                    if (event_type == systemSoftwareType && generatorType == "system_software_id" && recordType == "system_event_record") {
                        return (event_type == systemSoftwareType);
                    } else {
                        return (recordType == event_type);
                    }
                });

                return new collection(filtered);
            },

            byPendingDeassertion: function () {

                var ID = [];
                var collect = this.sortBy('id');
                var Collection = new collection(collect);
                var filtered_deasserted = Collection.filter(function (model) {
                    var event_direction = model.get("event_direction");
                    return (event_direction == "deasserted");
                });

                var collectiondeserted = new collection(filtered_deasserted);

                var filtered_asserted = Collection.filter(function (model) {
                    var event_direction = model.get("event_direction");
                    return (event_direction == "asserted");
                });
                var collectionasserted = new collection(filtered_asserted);
                collectionasserted.each(function (AssertModel) {
                    var Offset = AssertModel.get('offset');
                    var sensornumber = AssertModel.get('sensor_number');
                    var id = AssertModel.get('id');
                    if (ID.indexOf(id) == -1) {
                        collectiondeserted.each(function (DessertModel) {
                            if ((sensornumber == DessertModel.get("sensor_number")) && (Offset == DessertModel.get("offset") + 1) && DessertModel.get('id') > id && ID.indexOf(DessertModel.get('id')) == -1) {
                                ID.push(id);
                                ID.push(DessertModel.get('id'));
                            }
                        });
                    }
                });
                var finalfiltered = this.filter(function (model) {
                    var id = model.get("id");
                    return (ID.indexOf(id) == -1);
                });
                return new collection(finalfiltered);
            },

            bySensorandEventtype: function (sensor_id, event_type) {
                var filtered = this.filter(function (model) {
                    var sid = parseInt(model.get("sensor_number"), 10);
                    var eventType = model.get("record_type");
                    return (sid == sensor_id && eventType == event_type);
                });

                return new collection(filtered);
            },

            bySensorLunandEventtype: function (sensor_id, lun_number, event_type) {
                var filtered = this.filter(function (model) {
                    var sid = parseInt(model.get("sensor_number"), 10);
                    var eventType = model.get("record_type");
                    var ipmb_lun = model.get("ipmb_lun");
                    return (sid == sensor_id && eventType == event_type && ipmb_lun == lun_number);
                });

                return new collection(filtered);
            }

        });

        return new collection();

    });
