// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
    //##LANG_TAGS
    paths: {
        // Make vendor easier to access.
        "vendor": "../vendor",

        // Almond is used to lighten the output filesize.
        "almond": "../vendor/bower/almond/almond",

        // Opt for Lo-Dash Underscore compatibility build over Underscore.
        "underscore": "../vendor/bower/lodash/dist/lodash",

        "i18next": "../vendor/bower/i18next/i18next.amd",
        "text": "../vendor/bower/text/text",
        //csp enabled template
        "template":"../vendor/bower/undertemplate/src/undertemplate",
        // Map remaining vendor dependencies.
        "jquery": "../vendor/bower/jquery/dist/jquery",
        "backbone": "../vendor/bower/backbone/backbone",
        "layoutmanager": "../vendor/bower/layoutmanager/backbone.layoutmanager",
        "bower": "../vendor/bower",
        "tooltip": "../vendor/bower/bootstrap/js/tooltip",
        "dropdown": "../vendor/bower/bootstrap/js/dropdown",
        "alert": "../vendor/bower/bootstrap/js/alert",
        "modal": "../vendor/bower/bootstrap/js/modal",
        "backbone-validation": "../vendor/bower/backbone-validation/dist/backbone-validation-amd",
        "moment": "../vendor/bower/moment/moment",
        "moment-timezone": "../vendor/bower/moment-timezone/builds/moment-timezone-with-data.min",
        "timezone-meta-data": "./libs/timezone-meta",
        "supported_languages": "./libs/supported_languages",
        "features": "./feature",
        "datepicker": "../vendor/bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
        "collapse": "../vendor/bower/bootstrap/js/collapse",
        "raphael": "../vendor/bower/raphael/raphael",
        "morris": "../vendor/bower/morris.js/morris",
        //"jvectormap": "../vendor/bower/jvectormap/jquery-jvectormap",
        "fullcalendar": "../vendor/bower/fullcalendar/fullcalendar",
        //"knob": "../vendor/bower/jquery-knob/js/jquery.knob",
        //"wysihtml5": "../vendor/bower/bootstrap3-wysihtml5-bower/dist/bootstrap3-wysihtml5.all.min", //TODO: locale for wysi plugin
        "iCheck": "../vendor/bower/iCheck/icheck",
        //"inputmask": "../vendor/bower/jquery.inputmask/dist/jquery.inputmask.bundle",
        //"rangeslider": "../vendor/bower/ion.rangeSlider/js/ion.rangeSlider",
        "slimscroll": "../vendor/bower/jquery.slimscroll/jquery.slimscroll",
        //"pace": "../vendor/bower/pace/pace",
        //"boxrefresh": "./libs/boxrefresh",
        "center": "./libs/center",
        "resize": "./libs/resize",
        "todo": "./libs/todo",
        "treeview": "./libs/treeview",
        "select2": "../vendor/bower/select2/dist/js/select2",
        //"jvmlib": "../vendor/bower/jvectormap/lib",
        "sparkline": "../vendor/bower/kapusta-jquery.sparkline/dist/jquery.sparkline",
        "sortable": "../vendor/bower/Sortable/Sortable",
        "easypiechart": "../vendor/bower/jquery.easy-pie-chart/dist/jquery.easypiechart",
        "chartjs": "../vendor/bower/Chart.js/Chart",
        //"db": "../vendor/bower/db.js/src/db",
        //"prettify": "../vendor/bower/google-code-prettify/bin/prettify.min",
        //"cm": "../vendor/bower/codemirror/lib/codemirror",
        //"codemirror-python": "../vendor/bower/codemirror/mode/python/python",
        "notify": "../vendor/bower/notifyjs/dist/notify-combined",
        "footable": "../vendor/bower/footable/dist/footable.all.min",
        "c3": "../vendor/bower/c3/c3",
        "d3": "../vendor/bower/d3/d3",
        "videoplayback": "./libs/videoplayback",
        "tree-view": "../vendor/bower/bootstrap-treeview/dist/bootstrap-treeview.min",
        "contextmenu":"./libs/contextmenu",
        "json-viewer":"../vendor/bower/jquery.json-viewer/json-viewer/jquery.json-viewer",
        "xterm": "../vendor/bower/xterm.js/node_modules/xterm/lib/xterm",
        "xterm_addon_fit": "../vendor/bower/xterm.js/node_modules/xterm-addon-fit/lib/xterm-addon-fit",
        "aq_utils": "./aq_utils"
        //"json-viewer":"./libs/json-viewer"
        //"ydn.db": "../vendor/bower/ydn.db/jsc/ydn.db-dev"
        //##KVM_TAGS
        //##MEDIA_TAGS
        //##OEM_TAGS
    },

	map: {
        "*": {                                                                                                                                                                                              
            "i18n": "bower/requirejs-i18n/i18next"
        }   
    },  

    i18next: {
        lng: 'en',
        lowerCaseLng : true,
        fallbackLng: 'en',
        useCookie: true,
	cookieName:'lang',
        supportedLngs: {
                "en": ["model_errors", "videolog", "dual_firmware_update", "sol_trigger_settings", "general_firewall_rules", "discrete_states", "rmedia", "calendar", "lmedia", "sensor-details", "tasks", "event_filters", "javasol", "general", "common", "threshold_states", "system_inventory_info", "physical_device_info", "settings", "sensor_specific_states", "units", "updates", "raid_logical_physical_device_info", "logical_device_info", "remote_control", "dual_image_config", "nm_firmware_update", "date_time", "create_logical_device", "auditlog", "trigger_settings", "sensor", "firmware_update", "systemlog", "ip", "raid_controller_info", "smtp", "fru", "pre_event", "service_sessions", "services", "stats", "users", "sol_recorded_video", "hpm_firmware_update", "task_details", "bond", "error", "power_control", "log_details", "sasit_topology_info", "raid_event_log", "lan_destinations", "dashboard", "store", "bsod", "dns","active_directory","active_directory_certs","general_active_directory","rolegroup_active_directory","add_ip_rule","add_port_rule","alert_policies","auto","backup_config","bmc_recovery","dns_registration","ext_users","firewall","add_firewall_settings","general_firewall_settings","firmware_image_location","firmware_information","image_redirection","ip_firewall","ldap","rolegroup_ldap","license_add","license","view_license","advanced_log","SEL_log_settings_policy","advanced_log","log","maintenance","active_redirections","instance","remotesession","media","mouse","ncsi","link","network","nvme_controller_info","nvme_management","nvme_p3700_vpd_info","pam_order","pef","port_firewall","port_rules","advanced_radius","radius","general_radius","","bbu_info","raid_management","storage_summary","restore_configuration","restore_factory_defaults","sasit_controller_info","sasit_management","sasit_physical_device_info","sol","sol_launch","sol_remote_storage","ssl","generate_ssl","upload_ssl","view_ssl","video","remote_storage","general_ldap","ip_rules","pcie_partition_info","sensor_thresholds","pcie_switch_management","pcie_mgmt_dev_info","firmware_update_wizard","remotesession","manage_array_info","storage_summary", "host_interface_info","nvme_mi_management","nvme_mi_subsystem_info","nvme_mi_vpd_info", "aep","acd","host_debug", "sasit_event_log", "sasit_enclosure_info", "enclosure_info", "idled_control"/*nick20190522 idled*/,"create_lu_cache", "raid_topology_info", "nvme_mi_ssds_controller_firmware_update","nic_management","nic_controller_info","fpx", "disable_interface", "sasit_storage_summary", "pldm_sensor", "pldm", "user_policies", "sasit_controller_info", "raid_connector_info", "expander_info","system_status"],
    //##ZH_CN_TAG
    //##ZH_TW_TAG
            }   
    },

	inlineI18next: true,
    stubModules: ["bower/requirejs-i18n/i18next"],

    shim: {
        // This is required to ensure Backbone works as expected within the AMD
        // environment.
        "backbone": {
            // These are the two hard dependencies that will be loaded first.
            deps: ["jquery", "underscore","template"],

            // This maps the global `Backbone` object to `require("backbone")`.
            exports: "Backbone"
        },

        //"datepicker": ["jquery"],

        "bower/bootstrap/js/tab": ["jquery"],
        "bower/bootstrap/js/dropdown": ["jquery"],
        "bower/bootstrap/js/tooltip": ["jquery"],
        "bower/bootstrap/js/modal": ["jquery"],
        "collapse": ["jquery"],
        "bower/iCheck/icheck": ["jquery"],

        "c3": ["d3"],

        "notify": ["jquery"],
        "morris": ["jquery"],
        "jvectormap": ["jquery", "bower/jvectormap/jquery-mousewheel"
            /*, "jvmlib/jvectormap"
                    , "jvmlib/abstract-canvas-element"
                    , "jvmlib/abstract-element"
                    , "jvmlib/abstract-shape-element"
                    , "jvmlib/color-scale"
                    , "jvmlib/data-series"
                    , "jvmlib/numeric-scale"
                    , "jvmlib/ordinal-scale"
                    , "jvmlib/proj"
                    , "jvmlib/simple-scale"
                    , "jvmlib/svg-canvas-element"
                    , "jvmlib/svg-circle-element"
                    , "jvmlib/svg-element"
                    , "jvmlib/svg-group-element"
                    , "jvmlib/svg-path-element"
                    , "jvmlib/svg-shape-element"
                    , "jvmlib/vector-canvas"
                    , "jvmlib/vml-canvas-element"
                    , "jvmlib/vml-circle-element"
                    , "jvmlib/vml-element"
                    , "jvmlib/vml-group-element"
                    , "jvmlib/vml-path-element"
                    , "jvmlib/vml-shape-element"
                    , "jvmlib/world-map"*/
        ],
        "fullcalendar": ["jquery"],
        "knob": ["jquery"],
        "inputmask": ["jquery"],
        "rangeslider": ["jquery"],
        "slimscroll": ["jquery"],
        "boxrefresh": ["jquery"],
        "center": ["jquery"],
        "resize": ["jquery"],
        "todo": ["jquery"],
        "treeview": ["jquery"],
        "sparkline": ["jquery"],
        "easypiechart": ["jquery"],
        "footable": ["jquery"],
        "select2": ["jquery"],
        "tree-view": ["jquery"],
        "wysihtml5": ["backbone"],
        "bower/layoutManager/backbone.layoutmanager": ["backbone"],
        "bower/backbone-validation/dist/backbone-validation-amd": ["backbone"],
        "moment-timezone": ["moment"],
        "timezone-meta-data": ["moment-timezone"],
        "datepicker": ["collapse", "moment"]

        //##KVM_SHIMS
        //##MEDIA_SHIMS
        //##OEM_SHIMS
    },
	name: "main",
});
