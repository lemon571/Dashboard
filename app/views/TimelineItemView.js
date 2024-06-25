define([
    "jquery",
    "underscore",
    "backbone",
    "collection/sensors",

    "i18n!:common",
    //template
    'text!templates/timeline-item.html',
    'moment-timezone'
], function($, _, Backbone, SensorCollection, CommonStrings, TLITemplate, moment) {

    var view = Backbone.View.extend({

        tagName: "tr",

        template: template(TLITemplate),

        initialize: function() {

        },

        beforeRender: function() {
            //this.$el.addClass("animated fadeInDown");
        },

        afterRender: function() {
            this.$el.addClass("eventlog-item-holder sensor_" + this.model.get('sensor_number') + " " + this.model.get('record_type'));

            var sensor,sensor_icon,sensor_type;
            var bmc_time;
           // var bmc_time,client_time,client_frmNow;
            //here handled different events like Extended SEL event,OEM Record event and non-timestamp event.
            var severity = this.model.get('severity') == undefined ? "none" : this.model.get('severity').toLowerCase();
            sensor_icon=this.getIcon(severity);

            if(this.model.get("record_type")=="oem_record"){
                sensor="";
                sensor_type="OEM_RECORD";
            } else if(this.model.get("event_reading_class")=="oem") { //sensor name as "Unknown"
                sensor_type="OEM";
            } else{
                sensor = SensorCollection.getSensorwithLun(this.model.get('sensor_number'), this.model.get('ipmb_lun'));
                sensor_type=this.model.get('sensor_type');
                sensor_number=this.model.get('sensor_number');
            }
            if(this.model.get("event_description")== "oem_non_timestamped" && this.model.get("record_type")=="oem_record"){
                bmc_time=CommonStrings.t("common:pre_init_timestamp");
             //   client_time=CommonStrings.t("common:pre_init_timestamp");
            } else{
                var bmctz = window.sessionStorage.getItem("BMC_Timezone");
                // "moment" to convert utc-offset failed if timezone is "GMT+x" or "GMT-x".
                // So convert it to "Etc/GMT...
                if (bmctz == "GMT+01") bmctz = "Etc/GMT-1";
                else if (bmctz == "GMT+02") bmctz = "Etc/GMT-2";
                else if (bmctz == "GMT+03") bmctz = "Etc/GMT-3";
                else if (bmctz == "GMT+04") bmctz = "Etc/GMT-4";
                else if (bmctz == "GMT+05") bmctz = "Etc/GMT-5";
                else if (bmctz == "GMT+06") bmctz = "Etc/GMT-6";
                else if (bmctz == "GMT+07") bmctz = "Etc/GMT-7";
                else if (bmctz == "GMT+08") bmctz = "Etc/GMT-8";
                else if (bmctz == "GMT+09") bmctz = "Etc/GMT-9";
                else if (bmctz == "GMT+10") bmctz = "Etc/GMT-10";
                else if (bmctz == "GMT+11") bmctz = "Etc/GMT-11";
                else if (bmctz == "GMT+12") bmctz = "Etc/GMT-12";
                else if (bmctz == "GMT+13") bmctz = "Etc/GMT-13";
                else if (bmctz == "GMT-01") bmctz = "Etc/GMT+1";
                else if (bmctz == "GMT-02") bmctz = "Etc/GMT+2";
                else if (bmctz == "GMT-03") bmctz = "Etc/GMT+3";
                else if (bmctz == "GMT-04") bmctz = "Etc/GMT+4";
                else if (bmctz == "GMT-05") bmctz = "Etc/GMT+5";
                else if (bmctz == "GMT-06") bmctz = "Etc/GMT+6";
                else if (bmctz == "GMT-07") bmctz = "Etc/GMT+7";
                else if (bmctz == "GMT-08") bmctz = "Etc/GMT+8";
                else if (bmctz == "GMT-09") bmctz = "Etc/GMT+9";
                else if (bmctz == "GMT-10") bmctz = "Etc/GMT+10";
                else if (bmctz == "GMT-11") bmctz = "Etc/GMT+11";
                else if (bmctz == "GMT-12") bmctz = "Etc/GMT+12";
                else if (bmctz == "GMT-13") bmctz = "Etc/GMT+13";
                else if (bmctz == "GMT-14") bmctz = "Etc/GMT+14";
                else if (bmctz == "Etc/GMT-01") bmctz = "Etc/GMT-1";
                else if (bmctz == "Etc/GMT-02") bmctz = "Etc/GMT-2";
                else if (bmctz == "Etc/GMT-03") bmctz = "Etc/GMT-3";
                else if (bmctz == "Etc/GMT-04") bmctz = "Etc/GMT-4";
                else if (bmctz == "Etc/GMT-05") bmctz = "Etc/GMT-5";
                else if (bmctz == "Etc/GMT-06") bmctz = "Etc/GMT-6";
                else if (bmctz == "Etc/GMT-07") bmctz = "Etc/GMT-7";
                else if (bmctz == "Etc/GMT-08") bmctz = "Etc/GMT-8";
                else if (bmctz == "Etc/GMT-09") bmctz = "Etc/GMT-9";
                else if (bmctz == "Etc/GMT+01") bmctz = "Etc/GMT+1";
                else if (bmctz == "Etc/GMT+02") bmctz = "Etc/GMT+2";
                else if (bmctz == "Etc/GMT+03") bmctz = "Etc/GMT+3";
                else if (bmctz == "Etc/GMT+04") bmctz = "Etc/GMT+4";
                else if (bmctz == "Etc/GMT+05") bmctz = "Etc/GMT+5";
                else if (bmctz == "Etc/GMT+06") bmctz = "Etc/GMT+6";
                else if (bmctz == "Etc/GMT+07") bmctz = "Etc/GMT+7";
                else if (bmctz == "Etc/GMT+08") bmctz = "Etc/GMT+8";
                else if (bmctz == "Etc/GMT+09") bmctz = "Etc/GMT+9";

                bmc_time=moment((this.model.get('timestamp')*1000)+(new Date().getTimezoneOffset()*60*1000)).format("L, h:mm:ss a");
            }

            var cause = (sensor? sensor.name(): this.model.get('sensor_name') || "Unknown");

            var ad = this.model.get('advanced_event_description');

            var localtime  = new Date(this.model.get('timestamp')*1000);

            if (sensor_type == "drive_slot") {
                this.$(".client_fromnow").html(bmc_time);//moment((this.model.get('timestamp')*1000)+(moment.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).fromNow(),
                this.$(".sensor_id").html(this.model.get('id'));
                this.$('.var_cause').html(" Drive slot " + this.model.get('sensor_number') + " ");
                this.$(".event").html(this.model.description() + this.model.get("sel_data"));
                this.$(".sensor_icon").removeClass('sensor_icon').addClass(sensor_icon);
            } else {
                this.$(".client_fromnow").html(bmc_time);//moment((this.model.get('timestamp')*1000)+(moment.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).fromNow(),
                this.$(".sensor_id").html(this.model.get('id') + " ");
                this.$('.var_cause').html(cause);
                this.$(".timeline_cause").html(cause);
                this.$(".sensor_type").html(' sensor of type ' + sensor_type);
                this.$(".event").html(' logged a ' + this.model.description() + this.model.get("sel_data"));
                //client_time:client_time, //moment((this.model.get('timestamp')*1000)+(moment.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                this.$(".sensor_icon").removeClass('sensor_icon').addClass(sensor_icon);
                // this.$(".timeline-item");
                // .addClass("log-"+this.model.get('severity').toLowerCase());
                //sensor_number: this.model.get('sensor_number'),
                //record_type: this.model.get('record_type')
            }
        },

        getIcon: function(type) {
            var sensor_icons = {
                "none": "",
                "warning": "fa fa-exclamation-triangle text-yellow fa-lg",
                "unspecified": "fa-question-circle-o fa-lg",
                "ok": "fa fa-check-circle text-green fa-lg",
            };
            return sensor_icons[type.toLowerCase()] || "fa fa-times-circle text-red fa-lg";
        },

        serialize: function() {
            var sensor,sensor_icon,sensor_type;
           // var bmc_time,client_time,client_frmNow;
            //here handled different events like Extended SEL event,OEM Record event and non-timestamp event.
            var severity = this.model.get('severity') == undefined ? "none" : this.model.get('severity').toLowerCase();
            sensor_icon=this.getIcon(severity);

            if(this.model.get("record_type")=="oem_record"){    
                sensor="";
                sensor_type="OEM_RECORD";
            } else if(this.model.get("event_reading_class")=="oem") { //sensor name as "Unknown"
                sensor_type="OEM";
            } else{
              
                sensor = SensorCollection.getSensorwithLun(this.model.get('sensor_number'), this.model.get('ipmb_lun'));
                sensor_type=this.model.get('sensor_type');
            }
            if(this.model.get("event_description")== "oem_non_timestamped" && this.model.get("record_type")=="oem_record"){
                bmc_time=CommonStrings.t("common:oem_non_timestamped");
                // client_time=CommonStrings.t("common:oem_non_timestamped");
            } else if(moment(this.model.get('timestamp'), 'X').format('MMMM YYYY') == "January 1970"){
                bmc_time=CommonStrings.t("common:pre_init_timestamp");
             //   client_time=CommonStrings.t("common:pre_init_timestamp");
            } else{

                var bmctz = window.sessionStorage.getItem("BMC_Timezone");
                // "moment" to convert utc-offset failed if timezone is "GMT+x" or "GMT-x".
                // So convert it to "Etc/GMT...
                if (bmctz == "GMT+01") bmctz = "Etc/GMT-1";
                else if (bmctz == "GMT+02") bmctz = "Etc/GMT-2";
                else if (bmctz == "GMT+03") bmctz = "Etc/GMT-3";
                else if (bmctz == "GMT+04") bmctz = "Etc/GMT-4";
                else if (bmctz == "GMT+05") bmctz = "Etc/GMT-5";
                else if (bmctz == "GMT+06") bmctz = "Etc/GMT-6";
                else if (bmctz == "GMT+07") bmctz = "Etc/GMT-7";
                else if (bmctz == "GMT+08") bmctz = "Etc/GMT-8";
                else if (bmctz == "GMT+09") bmctz = "Etc/GMT-9";
                else if (bmctz == "GMT+10") bmctz = "Etc/GMT-10";
                else if (bmctz == "GMT+11") bmctz = "Etc/GMT-11";
                else if (bmctz == "GMT+12") bmctz = "Etc/GMT-12";
                else if (bmctz == "GMT+13") bmctz = "Etc/GMT-13";
                else if (bmctz == "GMT-01") bmctz = "Etc/GMT+1";
                else if (bmctz == "GMT-02") bmctz = "Etc/GMT+2";
                else if (bmctz == "GMT-03") bmctz = "Etc/GMT+3";
                else if (bmctz == "GMT-04") bmctz = "Etc/GMT+4";
                else if (bmctz == "GMT-05") bmctz = "Etc/GMT+5";
                else if (bmctz == "GMT-06") bmctz = "Etc/GMT+6";
                else if (bmctz == "GMT-07") bmctz = "Etc/GMT+7";
                else if (bmctz == "GMT-08") bmctz = "Etc/GMT+8";
                else if (bmctz == "GMT-09") bmctz = "Etc/GMT+9";
                else if (bmctz == "GMT-10") bmctz = "Etc/GMT+10";
                else if (bmctz == "GMT-11") bmctz = "Etc/GMT+11";
                else if (bmctz == "GMT-12") bmctz = "Etc/GMT+12";
                else if (bmctz == "GMT-13") bmctz = "Etc/GMT+13";
                else if (bmctz == "GMT-14") bmctz = "Etc/GMT+14";
                else if (bmctz == "Etc/GMT-01") bmctz = "Etc/GMT-1";
                else if (bmctz == "Etc/GMT-02") bmctz = "Etc/GMT-2";
                else if (bmctz == "Etc/GMT-03") bmctz = "Etc/GMT-3";
                else if (bmctz == "Etc/GMT-04") bmctz = "Etc/GMT-4";
                else if (bmctz == "Etc/GMT-05") bmctz = "Etc/GMT-5";
                else if (bmctz == "Etc/GMT-06") bmctz = "Etc/GMT-6";
                else if (bmctz == "Etc/GMT-07") bmctz = "Etc/GMT-7";
                else if (bmctz == "Etc/GMT-08") bmctz = "Etc/GMT-8";
                else if (bmctz == "Etc/GMT-09") bmctz = "Etc/GMT-9";
                else if (bmctz == "Etc/GMT+01") bmctz = "Etc/GMT+1";
                else if (bmctz == "Etc/GMT+02") bmctz = "Etc/GMT+2";
                else if (bmctz == "Etc/GMT+03") bmctz = "Etc/GMT+3";
                else if (bmctz == "Etc/GMT+04") bmctz = "Etc/GMT+4";
                else if (bmctz == "Etc/GMT+05") bmctz = "Etc/GMT+5";
                else if (bmctz == "Etc/GMT+06") bmctz = "Etc/GMT+6";
                else if (bmctz == "Etc/GMT+07") bmctz = "Etc/GMT+7";
                else if (bmctz == "Etc/GMT+08") bmctz = "Etc/GMT+8";
                else if (bmctz == "Etc/GMT+09") bmctz = "Etc/GMT+9";

                bmc_time=moment((this.model.get('timestamp')*1000)+(new Date().getTimezoneOffset()*60*1000)).format("dddd, MMMM Do YYYY, h:mm:ss a");
//                client_time=moment((this.model.get('timestamp')*1000)+(momenяt.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).format("dddd, MMMM Do YYYY, h:mm:ss a");
//              client_frmNow=moment((this.model.get('timestamp')*1000)+(moment.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).fromNow();                
            // client_time=moment((this.model.get('timestamp')*1000)+(moment.tz(bmctz)._offset*60*1000)).format("dddd, MMMM Do YYYY, h:mm:ss a");

            }


            var cause = (sensor? sensor.name(): this.model.get('sensor_name') || "Unknown");

            var ad = this.model.get('advanced_event_description');

            var localtime  = new Date(this.model.get('timestamp')*1000);
            return {
                locale: CommonStrings
                /*BMC_fromnow: moment((this.model.get('timestamp')*1000)+(new Date().getTimezoneOffset()*60*1000)).fromNow(),
                Client_fromnow:client_frmNow,//moment((this.model.get('timestamp')*1000)+(moment.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).fromNow(),
                sensor_id: "ID: " + this.model.get('id') + " ",
                cause: cause,
                sensor_type:sensor_type ,  
                //event: this.model.description() + "<br>"+this.model.get("sel_hexdata")+ "<br>" +this.model.get("sel_data"),
                event: this.model.description() + "<br>"+this.model.get("sel_data")+ "<br>",
                event_message: this.model.get('event_direction') + ' ' + ((ad!='unknown')?ad:'') + " on ",
                bmc_time:bmc_time, //moment((this.model.get('timestamp')*1000)+(new Date().getTimezoneOffset()*60*1000)).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                //client_time:client_time, //moment((this.model.get('timestamp')*1000)+(moment.tz(window.sessionStorage.getItem("BMC_Timezone"))._offset*60*1000)).format("dddd, MMMM Do YYYY, h:mm:ss a"),                
                sensor_icon: sensor_icon,
                sensor_number: this.model.get('sensor_number'),
                record_type: this.model.get('record_type')*/
            };
        }
    });

    return view;

});
