define(["jquery", "underscore", "backbone", "app", "i18n!:sensor_thresholds"],

function($, _, Backbone, app, locale) {

    var model = Backbone.Model.extend({

        defaults: {},

        validation: {
            higher_non_recoverable_threshold: {
                fn: function(value, attr, computedState) {
                    if(value == 'NA'){
                        return false;
                    } else if (value != 'NA' && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)))) {
                        return true;
                    } else {
                        return false;
                    }

                    /*if (value != 'NA' && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)))) {
                        return true;
                    } else {
                        return false;
                    }*/
                },
                //msg: function(){return locale.t("sensor_thresholds:invalid_upper_nonrecoverable_value_refer_help_content")}
                msg: function(){return locale.t("sensor_thresholds:invalid_unr_value_refer_help_content")}
            },
            higher_critical_threshold: {
                fn: function(value, attr, computedState) {
                    if( (value == 'NA' || computedState.higher_non_recoverable_threshold == 'NA')){
                        return false;
                    } else if ( (value != 'NA' && computedState.higher_non_recoverable_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_recoverable_threshold))) ) {
                        return true;
                    } else {
                        return false;
                    }

                    /*if ((value != 'NA' || computedState.higher_non_recoverable_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_recoverable_threshold)))) {
                        return true;
                    } else {
                        return false;
                    }*/
                },
                //msg: function(){return locale.t("sensor_thresholds:invalid_upper_critical_value_or_upper_critical_value_cannot_be_bigger_than_upper_nonrecoverable_value")}
                msg: function(){return locale.t("sensor_thresholds:invalid_uc_value_or_uc_value_cannot_be_bigger_than_above_field_value")}
            },
            higher_non_critical_threshold: {
                fn: function(value, attr, computedState) {
                    if(value == 'NA' || (computedState.higher_critical_threshold == 'NA' && computedState.higher_non_recoverable_threshold == 'NA')){
                        return false;
                    } else if ((value != 'NA' && computedState.higher_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_critical_threshold)))) {
                        return true;
                    } else if ( (value != 'NA' && computedState.higher_non_recoverable_threshold != 'NA' && computedState.higher_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_recoverable_threshold))) ) {
                        return true;
                    } else {
                        return false;
                    }

                    /*if ((value != 'NA' || computedState.higher_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_critical_threshold)))) {
                        return true;
                    } else {
                        return false;
                    }*/
                },
                //msg: function(){return locale.t("sensor_thresholds:invalid_upper_noncritical_value_or_upper_noncritical_value_cannot_be_bigger_than_upper_critical_value")}
                msg: function(){return locale.t("sensor_thresholds:invalid_unc_value_or_unc_value_cannot_be_bigger_than_above_field_value")}
            },
            lower_non_critical_threshold: {
                fn: function(value, attr, computedState) {
                    if(value == 'NA' || (computedState.higher_non_critical_threshold == 'NA' && computedState.higher_critical_threshold == 'NA' && computedState.higher_non_recoverable_threshold == 'NA')){
                        return false;
                    } else if ((value != 'NA' && computedState.higher_non_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_critical_threshold)))) {
                        return true;
                    } else if ((value != 'NA' && computedState.higher_critical_threshold != 'NA' && computedState.higher_non_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_critical_threshold)))) {
                        return true;
                    } else if ( (value != 'NA' && computedState.higher_non_recoverable_threshold != 'NA' && computedState.higher_non_critical_threshold == 'NA' && computedState.higher_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_recoverable_threshold))) ) {
                        return true;
                    } else {
                        return false;
                    }

                    /*if ((value != 'NA' || computedState.higher_non_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_critical_threshold)))) {
                        return true;
                    } else {
                        return false;
                    }*/
                },
                //msg: function(){return locale.t("sensor_thresholds:invalid_lower_noncritical_value_or_lower_noncritical_value_cannot_be_bigger_than_upper_noncritical_value")}
                msg: function(){return locale.t("sensor_thresholds:invalid_lnc_value_or_lnc_value_cannot_be_bigger_than_above_field_value")}
            },
            lower_critical_threshold: {
                fn: function(value, attr, computedState) {
                    if(value == 'NA' || (computedState.lower_non_critical_threshold == 'NA' && computedState.higher_non_critical_threshold == 'NA' && computedState.higher_critical_threshold == 'NA' && computedState.higher_non_recoverable_threshold == 'NA')){
                        return false;
                    } else if ((value != 'NA' && computedState.lower_non_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.lower_non_critical_threshold)))) {
                        return true;
                    } else if ((value != 'NA' && computedState.higher_non_critical_threshold != 'NA' && computedState.lower_non_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_critical_threshold)))) {
                        return true;
                    } else if ((value != 'NA' && computedState.higher_critical_threshold != 'NA' && computedState.lower_non_critical_threshold == 'NA' && computedState.higher_non_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_critical_threshold)))) {
                        return true;
                    } else if ( (value != 'NA' && computedState.higher_non_recoverable_threshold != 'NA' && computedState.lower_non_critical_threshold == 'NA' && computedState.higher_non_critical_threshold == 'NA' && computedState.higher_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_recoverable_threshold))) ) {
                        return true;
                    } else {
                        return false;
                    }

                    /*if ((value != 'NA' || computedState.lower_non_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.lower_non_critical_threshold)))) {
                        return true;
                    } else {
                        return false;
                    }*/
                },
                //msg: function(){return locale.t("sensor_thresholds:invalid_lower_critical_value_or_lower_critical_value_cannot_be_bigger_than_lower_noncritical_value")}
                msg: function(){return locale.t("sensor_thresholds:invalid_lc_value_or_lc_value_cannot_be_bigger_than_above_field_value")}
            },
            lower_non_recoverable_threshold: {
                fn: function(value, attr, computedState) {
                    if(value == 'NA' || (computedState.lower_critical_threshold == 'NA' && computedState.lower_non_critical_threshold == 'NA' && computedState.higher_non_critical_threshold == 'NA' && computedState.higher_critical_threshold == 'NA' && computedState.higher_non_recoverable_threshold == 'NA')){
                        return false;
                    } else if ((value != 'NA' && computedState.lower_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.lower_critical_threshold)))) {
                        return true;
                    }else if ((value != 'NA' && computedState.lower_non_critical_threshold != 'NA' && computedState.lower_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.lower_non_critical_threshold)))) {
                        return true;
                    } else if ((value != 'NA' && computedState.higher_non_critical_threshold != 'NA' && computedState.lower_critical_threshold == 'NA' && computedState.lower_non_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_critical_threshold)))) {
                        return true;
                    } else if ((value != 'NA' && computedState.higher_critical_threshold != 'NA' && computedState.lower_critical_threshold == 'NA' && computedState.lower_non_critical_threshold == 'NA' && computedState.higher_non_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_critical_threshold)))) {
                        return true;
                    } else if ( (value != 'NA' && computedState.higher_non_recoverable_threshold != 'NA' && computedState.lower_critical_threshold == 'NA' && computedState.lower_non_critical_threshold == 'NA' && computedState.higher_non_critical_threshold == 'NA' && computedState.higher_critical_threshold == 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.higher_non_recoverable_threshold))) ) {
                        return true;
                    } else {
                        return false;
                    }

                    /*if ((value != 'NA' || computedState.lower_critical_threshold != 'NA') && (!(/^[0-9]*(\.[0-9]+)?$/.test(value)) || !(value != "") || (parseInt(value) > parseInt(computedState.lower_critical_threshold)))) {
                        return true;
                    } else {
                        return false;
                    }*/
                },
                //msg: function(){return locale.t("sensor_thresholds:invalid_lower_nonrecoverable_value_or_lower_nonrecoverable_value_cannot_be_bigger_than_lower_critical_value")}
                msg: function(){return locale.t("sensor_thresholds:invalid_lnr_value_or_lnr_value_cannot_be_bigger_than_above_field_value") +""}
            }
        },

        url: function() {
            //return "/api/settings/sensor-threshold/" + location.hash.split('/').pop()
            return "/api/settings/sensor-threshold"
        }
    });

    return new model();

});
