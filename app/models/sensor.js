define(['underscore', 'backbone',
        'i18n!:units',
        'i18n!:discrete_states',
        'i18n!:sensor_specific_states',
        'i18n!:threshold_states'
    ],
    function(_, Backbone, units, discrete_states, sensor_specific_states, threshold_states) {

        var model = Backbone.Model.extend({

            unit: function() {
                //return units[this.get('base_unit')];
                var u = this.get('unit');

                switch(u) {
                    case 'deg_c':
                        u = String.fromCharCode(176)+'C';
                    break;
                    default:
                        u = u.split('');
                        u[0]  =(u[0]==undefined)?"unknown":u[0].toUpperCase();
                        u = u.join('');
                }
            	return u;
            },

            name: function() {
                return this.get('name').replace(/[^\x20-\x7E]+/g, '');;
            },

            state: function() {
                var st = "",
                    bitpos = 0;

                if (this.get('type_number') >= 0xC0 && this.get('type_number') <= 0xFF) {
                    return "Manufacturer Specific Discrete State ("+this.get('discrete_state')+")";
                }

                if (this.get('sensor_state')) {

                    for (bitpos = 0; bitpos < 8; bitpos++) {
                        if (this.get('sensor_state') & (0x01 << bitpos)) {
                            //st += threshold_states["threshold_" + (0x01 << bitpos)] + " ";

                               var value = 'threshold_states:threshold_' + + (0x01 << bitpos);
                             st +=  threshold_states.t(value);
                        }
                    }
                    console.log(st);
                } else {
                    if (this.get('sensor_number') == 12)
                        console.log('PCM sensor_specific_' + this.get('type_number') + '_' + bitpos);
                    for (bitpos = 0; bitpos < 14 && this.get('reading'); bitpos++) {
                        if (this.get('reading') & (0x01 << bitpos)) {
                            //console.log('reading bit set');
                            if (this.get('discrete_state') >= 0x02 && this.get('discrete_state') <= 0x0c) {
                               // st += discrete_states['generic_discrete_' + this.get('discrete_state') + '_' + bitpos] + " ";
                                   var value = 'discrete_states:generic_discrete_' + this.get('discrete_state') + '_' + bitpos;
                                   st += discrete_states.t(value);
                            } else if (0x6F == this.get('discrete_state')) {
                                //st += sensor_specific_states['sensor_specific_' + this.get('type_number') + '_' + bitpos] + " ";
                                var value = 'sensor_specific_states:sensor_specific_' + this.get('type_number') + '_' + bitpos;
                                if(st!=""){
                                    st +=  ", " + sensor_specific_states.t(value);
                                }else{
                                    st +=  sensor_specific_states.t(value);
                                }
                            } else if (this.get('discrete_state') >= 0x70 && this.get('discrete_state') <= 0x7F) {
                                //TODO: check OEM specific information..
                                st = "Manufacturer Specific";
                            }
                            //console.log(st);
                        }
                    }
                    if (!st) {
                        st = "No state defined";
                    }
                }
                console.log(st);
                return st;
            },

            sensorType: function() {
            	
            	if(typeof this.get('type') == 'string') return this.get('type');

                switch (this.get('type')) {
                    case 1:
                        return "temperature";
                    case 2:
                        return "voltage";
                    case 3:
                        return "current";
                    case 4:
                        return "fan";
                    case 5:
                        return "chassis_intrusion";
                    case 6:
                        return "platform_security_violation";
                    case 7:
                        return "processor";
                    case 8:
                        return "power_supply";
                    case 9:
                        return "power_unit";
                    case 10:
                        return "cooling_device";
                    case 11:
                        return "other_units";
                    case 12:
                        return "memory";
                    case 13:
                        return "drive_slot";
                    case 14:
                        return "post_memory_resize";
                    case 15:
                        return "system_firmware_error";
                    case 16:
                        return "event_logging_disabled";
                    case 17:
                    case 35:
                        return "watchdog";
                    case 18:
                        return "system_event";
                    case 19:
                        return "critical_interrupt";
                    case 20:
                        return "button";
                    case 21:
                        return "board";
                    case 22:
                        return "microcontroller";
                    case 23:
                        return "add_in_card";
                    case 24:
                        return "chassis";
                    case 25:
                        return "chipset";
                    case 26:
                        return "other_fru";
                    case 27:
                        return "cable";
                    case 28:
                        return "terminator";
                    case 29:
                        return "system_boot";
                    case 30:
                        return "boot_error";
                    case 31:
                        return "base_os_boot";
                    case 32:
                        return "os_shutdown";
                    case 33:
                        return "slot";
                    case 34:
                        return "system_acpi";
                    case 36:
                        return "platform_alert";
                    case 37:
                        return "entity_presence";
                    case 38:
                        return "monitor_asic";
                    case 39:
                        return "lan";
                    case 40:
                        return "management_subsystem_health";
                    case 41:
                        return "battery";
                    case 42:
                        return "session_audit";
                    case 43:
                        return "version_change";
                    case 44:
                        return "fru_state";
                }
                if (this.get('type') >= 0xC0 && this.get('type') <= 0xFF) {
                    return "oem_reserved";
                }
            },

            hnr: function() {
                return this.get('higher_non_recoverable_threshold');
            },

            hc: function() {
                return this.get('higher_critical_threshold');
            },

            hnc: function() {
                return this.get('higher_non_critical_threshold');
            },

            lnc: function() {
                return this.get('lower_non_critical_threshold');
            },

            lc: function() {
                return this.get('lower_critical_threshold');
            },

            lnr: function() {
                return this.get('lower_non_recoverable_threshold');
            },

            reading: function() {
                return this.get('reading');
            },

            getPercent: function() {
                var l = -this.lnr();
                var h = this.hnr() + l;
                var r = this.reading() + l;

                return Math.ceil((r / h) * 100);
            },

            isCritical: function() {
                if ((this.get('reading') >= this.get('higher_non_critical_threshold')) ||
                    (this.get('reading') <= this.get('lower_non_critical_threshold'))) {
                    return true;
                } else {
                    return false;
                }
            },

            isNormal: function() {
                if ((this.get('reading') < this.get('higher_non_critical_threshold')) &&
                    (this.get('reading') > this.get('lower_non_critical_threshold'))) {
                    return true;
                } else {
                    return false;
                }
            }

        });

        return model;

    });
