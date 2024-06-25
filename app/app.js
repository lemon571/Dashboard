/*define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var _ = require("underscore");
  var $ = require("jquery");
  var Backbone = require("backbone");

  // Alias the module for easier identification.
  var app = module.exports;

  // The root path to run the application through.
  app.root = "/";
});
*/
define([
        // Libraries.
        "jquery",
        "underscore",
        "backbone",
        "HTTPErrorHandler",
        "collection/event-log",
        "collection/project-configurations",
        "collection/runtime-configurations",
        'collection/sensors',
        'collection/sensors-reading',
        "collection/messages",
        'collection//licenses',
        "models/message",
        "models/chassis_status",
        "supported_languages",
        //views
        //locale
        "i18n!:common",
        //template
        'text!templates/layouts/main.html',
        'text!templates/layouts/login.html',
        'text!templates/layouts/withoutmenu.html',
        "i18next",
        // Plugins.
        //"db",
        "layoutmanager",
        "backbone-validation",
        "moment",
        "template",
        "dropdown",
        "slimscroll",
        "select2"
        //"ydn.db"
    ],

    function($, _, Backbone, HTTPErrorHandler, EventLogCollection, ProjectConfigCollection, RuntimeConfigCollection, SensorCollection, SensorReadingCollection, MessageCollection,LicensesCollection, MessageModel, ChassisStatusModel,supportedlanguages,
        CommonStrings, MainTemplate, LoginTemplate, WithoutMenuTemp,i18next, Layout, Validation,moment) {
            "use strict";



        Backbone.Model.prototype = _.extend(Backbone.Model.prototype, Validation.mixin);

        //Constants
        window.CONSTANTS = {};
        //Privilege
        window.CONSTANTS["CALLBACK"] = 1;
        window.CONSTANTS["USER"] = 2;
        window.CONSTANTS["OPERATOR"] = 3;
        window.CONSTANTS["ADMIN"] = 4;
        window.CONSTANTS["OEM"] = 5;
        //Fixed User count
        window.CONSTANTS["FIXED_USER_COUNT"] = 2;
        // Total User Counts
        window.CONSTANTS["TOTAL_USER_COUNT"] = 15;
        window.settings = false;

        //Localize or create a new JavaScript Constants like Global variables.
        var CONSTANTS = window.CONSTANTS = window.CONSTANTS || {};

        // Provide a global location to place configuration settings and module
        // creation.
        var F5detect = false;
        var app = {
            root: "./",
            IR_rmedia_sync_is_on: false,
            IR_lmedia_sync_is_on: false,
            BRAND_TITLE_NAME: CommonStrings.t("common:title"),
            DASHBOARD_WIDGET:true,
            AfterRenderHitted: false,

            initialize: function() {

                console.log("App initialized...");
                // Dynamically added brand title
                app.brand_title = this.BRAND_TITLE_NAME;
                $(".logo").html(app.brand_title);
                document.title = app.brand_title;

                $("#processing_text").html(CommonStrings.t("common:processing"));

                $(document).on("contextmenu",function(e){
                    if (event.button == 2){
                        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                    }
                });
		$(document).on("keyup",function(e){
				F5detect=false;

				});
                $(document).on("keydown",function(e){

				if (((e.which || e.keyCode) == 116) && (F5detect ==false)){

					/* Disabled F5 button and trigger customized refresh.*/
					F5detect=true;
					e.preventDefault(); 

					$( "#refreshPage" ).trigger( "click" );

				}

				});

                locale = CommonStrings;

                //this.layout.on("afterRender", );

                if (!document.cookie) {
                    return;
                }
                var thats = this;
                //garc - csrftoken.. just a name change here
                $.ajaxSetup({
                    headers: {'X-CSRFTOKEN': localStorage.getItem("garc")}
                });

                this.useLayout("layouts/main");

                $(document).ajaxStart(thats.showLoader).ajaxStop(thats.hideLoader);

                $(".username").text(window.sessionStorage.getItem('username'));
                //$(".privilege").text("Administrator");
                var priv_id = window.localStorage.getItem('privilege_id');
                $(".privilege").text(locale.t("common:priv_"+priv_id));
                var priv_text = window.localStorage.getItem('privilege');
                if(priv_text == "Oem"){
                    $(".privilege").text(locale.t("common:priv_5"));
                }
                //$(".since").text("Apr. 2014");
                //$(".bmc-name").text("SPX BMC RR11.6");

                $("#main").addClass("skin-black");

                var ipmi_events_schema = {
                    name: 'ipmi_events',
                    keyPath: 'id',
                    autoIncrement: false,
                    indexes: [{
                        name: 'timestamp'
                    }, {
                        name: 'sensor_number'
                    }, {
                        name: 'sensor_name'
                    }, {
                        name: 'event_direction'
                    }, {
                        name: 'record_type'
                    }, {
                        name: 'system_software_type'
                    }, {
                        name: 'generator_type'
                    }, {
                        name: 'channel_number'
                    }, {
                        name: 'sensor_type'
                    }, {
                        name: 'event_description'
                    }, {
                        name: 'mark_read'
                    }, {
                        name: 'sensor_timestamp',
                        keyPath: ['sensor_number', 'timestamp']
                    }]
                };

                var schema = {
                    stores: [ipmi_events_schema]
                };

                //this.db = new ydn.db.Storage('bmc', schema);

                //this.db.clear();

                //EventLogCollection.on("add", this.addLogs, this);
                // EventLogCollection.on("loaded", this.notify, this);

                var context = this;
                this.configurations = ProjectConfigCollection;
                this.runtime_configurations = RuntimeConfigCollection;
                this.EventLogCollection = EventLogCollection;
                this.SensorCollection = SensorCollection;
                this.SensorReadingCollection = SensorReadingCollection
                this.licenses=LicensesCollection;
                this.Chassis = ChassisStatusModel;
                this.totalEventRecords = 0;
                this.LASTEVENTID = 0;
                if (window.sessionStorage.getItem("garc") != null || window.localStorage.getItem("garc") != null) {
                    app.SessionStorage();
                    sessionStorage.setItem("features", JSON.stringify(ProjectConfigCollection.toJSON()));
                    localStorage.setItem("features", JSON.stringify(ProjectConfigCollection.toJSON()));
                    context.features = ProjectConfigCollection.pluck('feature');
                    ProjectConfigCollection.trigger('features_loaded');
                    var featureList = context.features;
                    var routerLink = context.router.routes;
                    var autorouterLink;
                    if (context.auto_router != undefined)
                        autorouterLink = context.auto_router.routes;


            var featureLink = $.extend({}, context.router.routerfeatures, context.auto_router.routerfeatures);
            var quickLinks = $.extend({}, routerLink, autorouterLink);

            if (context.fpx_router != undefined) {
                featureLink = $.extend({}, featureLink, context.fpx_router.routerfeatures);
                quickLinks = $.extend({}, quickLinks, context.fpx_router.routes);
            }

            var unwantedLinks = "#remote#updates#help#login#logout#settings/sensor_thresholds#settings/service_sessions#store#settings/dns/dns_registration#settings/raid_management/bbu_info#";

            var objDisabledLink = [];
            $.each(featureLink, function (key, value) {
                if (featureList.indexOf(key) == -1) {
                    objDisabledLink.push(value);
                }

            });
            var str = "";
            $.each(objDisabledLink, function (k, v) {
                for (var val in v) {
                    //str = str + val.toString()+ "," ;
                    str = str + "'" + val.toString() + "',";
                }
            });
            str = str.substring(0, str.length - 1);

            $.each(quickLinks, function (key, value) {

                if (key.indexOf("/:") == -1 && unwantedLinks.indexOf("#" + key + "#") == -1 && str.search(key) == -1) {
                    var links = key.replace(/\//g, " ").replace(/\s/g, " > ").replace(/\w\S*/g, function (txt) {
                        
							return locale.t("common:" + txt.toLowerCase());
						
                    });
					//nick20190522 to remove the quicklink for pcie --start
					if(links.search("pcie")==-1)
					{
						//console.log(links);
						$('#idQuicklinks').append('<option value="' + key + '">' + links + '</option>');
					}
					//nick20190522 to remove the quicklink for pcie --end
						
					
                }



            });

            app.featureFilter();
            if (context.features.indexOf("RUNTIME_LICENSE") != -1) {
                //call license info
                var strLicense = ""; //String to hold the Un-licensed services
                context.licenses.fetch({
                    success: function () {
                        console.log(context.licenses.length);
                        if (context.licenses.length > 0) {
                            context.licenses.each(function (model) {
                                console.log(parseInt(model.get("validity")));
                                if (model.get("feature") != "" &&
                                    parseInt(model.get("validity")) == 0) {
                                    strLicense += model.get("feature") + ",";
                                }
                            }, context);

                            context.unLicensed = strLicense;
                            app.licensesFilter();

                            window.sessionStorage.setItem('License', strLicense);
                            window.localStorage.setItem('License', strLicense);
                        }
                    }
                });
            }
            //this API call commented since this will be called in Media Instance,Remotesession screens.
            /*RuntimeConfigCollection.fetch({
                success: function() {
                    RuntimeConfigCollection.trigger('runtime_features_loaded');
                    context.runtimeFeatureFilter();
                }
            });*/
            context.runtime_configurations.bind("runtime_feature_update", context.runtimeFeatureFilter, context);
            /*
            context.EventLogCollection.fetch({
                data: $.param({
                    LASTEVENTID: context.LASTEVENTID
                })
            });
            */
            //context.SensorCollection.fetch();
            context.Chassis.bind("change:power_status", function (model, value) {
                this.updateChassisHeaderStatus(value);
            }, context);

            context.Chassis.bind("change:led_status", function (model, value) {
                this.updateIDLedHeaderStatus(value);
            }, context);

            context.Chassis.bind("change:system_status", function (model, value) {
                this.updateSystemHealthHeaderStatus(value);
            }, context);

            context.Chassis.fetch();
            context.FwInfo.fetch({
                success: function (model) {
                    $(".fm-asset-tag").text(model.get("asset_tag"));
                    $(".fm-revision").text(model.get("fw_ver"));
                    $(".fm-date").text(model.get("date") + " " + model.get("time"));
                    $(".bios-version").text(model.get("bios_ver"));
                }
                    });
                    /*error: function(e, x, s) {
            console.log("get project config error");
           var Cookiename = "refresh_disable";
            var myCookie;
            var nameEQ = Cookiename + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) {
                    myCookie = c.substring(nameEQ.length, c.length);
                }
            }
         
            if (myCookie == 1) {
                app.logout();
                document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
              //document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                location.href = "#login";
                location.reload();
                        }
                    }*/
                }

                this.runtimeFeatureFilter = function(ev) {
                    if (!context.runtime_configurations.length) return;

                    $("*[data-runtime-feature]").each(function(c, el) {
                        if (!context.runtime_configurations.isFeatureEnabled($(el).data("runtime-feature"))) {
                            $(el).hide();
                        } else {
                            if ($(el).hasClass('hide') && !$(el).hasClass('help-item')) { $(el).removeClass('hide'); }
                            $(el).not('.help-item').show();
                            context.featureFilter('.content');
                        }
                    });

                    $("*[data-runtime-not-feature]").each(function(c, el) {
                        console.log($(el).data("runtime-not-feature"), context.runtime_configurations.isFeatureEnabled($(el).data("runtime-not-feature")));
                        if (context.runtime_configurations.isFeatureEnabled($(el).data("runtime-not-feature"))) {
                            $(el).hide();
                        } else {
                            if ($(el).hasClass('hide') && !$(el).hasClass('help-item')) { $(el).removeClass('hide'); }
                            $(el).not('.help-item').show();
                            context.featureFilter('.content');
                        }
                    });
                }




                //Use app.poll to start listening on a timer
                //Currently timer events come as 2sec, 5sec, 10sec, 15sec
                //Look below in this file to add more if needed
                this.poll = _.extend({}, Backbone.Events);

                //Use this events for handling save/error events of generated pages from webui_scaffold package
                //Possible events are save_success, save_error. The handler function for this error receives the view context as first arg
                //The associated model/collection can be traversed from the view context
                this.events = _.extend({}, Backbone.Events);

                this.events.on("save_success", function() {
                    var alertText = $(".alert-success").text().split("---");
                    var str = alertText[0];
                    if(window.curLng.indexOf("en") != -1)
 		            { 
 		                $(".alert-success").text(str.replace(/[^a-zA-Z0-9.\- ]/g, "").trim()); 
 		            } 
 		            else  
 		            { 
 	                    $(".alert-success").text(str.trim()); 
 		            }  
 		            $(".alert-success").removeClass("hide");
					setTimeout(function() {
                        $(".alert-success").addClass("hide");
                    }, 5000);
                    if (typeof(alertText[1]) != "undefined") {
                        $("body").addClass("disable_a_href");
                            app.logout();
                        setTimeout(function() {
                            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            app.router.navigate("login");
                            location.reload();
                        }, 60000);

                    }
                });

                this.events.on("save_error", function() {
                    $(".alert-danger").removeClass("hide");
                    /*setTimeout(function(){
                        $(".alert-danger").addClass("hide");
                    }, 10000);*/
                });

                this.events.on("save_success_alert", function() {
                    //alert($(".alert-success").text());
                    var alertText = $(".alert-success").text().split("---");
                    var str = alertText[0];
					if(window.curLng.indexOf("en") != -1) 
 		            {     
 		                alert(str.replace(/[^a-zA-Z0-9.\- ]/g, "").trim()); 
 	                }     
 		            else  
 	                {     
 		                alert(str.trim()); 
 		            }                     
                     if (typeof(alertText[1]) != "undefined") {
						app.logout(); 
                        $("body").addClass("disable_a_href");
                        setTimeout(function() {
                            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            app.router.navigate("login");
                            location.reload();
                        }, 60000);

                    }
                });
                this.events.on("save_error_alert", function() {
                    var alertText = $(".alert-danger").text().split("---");
                    var str = alertText[0];
                    if(window.curLng.indexOf("en") != -1) 
                    {     
                        alert(str.replace(/[^a-zA-Z0-9.\- ]/g, "").trim()); 
                    }     
                    else  
                    {     
                        alert(str.trim()); 
                    }                     
                    if (typeof(alertText[1]) != "undefined" && alertText[1].indexOf("Logout") > -1) {
                            app.logout();
                        $("body").addClass("disable_a_href");
                        setTimeout(function() {
                            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            app.router.navigate("login");
                            location.reload();
                        }, 60000);

                    }
                });

                //this.setPolls();
                this.setChassisPoll();

                /*  window.unload = function(){
                        app.logout();
                    }*/

                window.onbeforeunload = function(e) {
                    if (window.cdrom) {
                        return CommonStrings.t("common:media_refresh_warning");
                    } else if (window.fw_upgrade) {
                        $("body").addClass("disable_a_href");
                        var remember_chkbx = localStorage.getItem('remember_chkbx');
                        var remember_usrname = localStorage.getItem('remember_usrname');
                        localStorage.clear();
                        localStorage.setItem('remember_chkbx',remember_chkbx);
                        localStorage.setItem('remember_usrname',remember_usrname);
                        var newEventCount = sessionStorage.getItem('newEventCount');
                        sessionStorage.clear();
                        sessionStorage.setItem('newEventCount', newEventCount);
                        document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        $.ajax({
                            beforeSend: function (jqXHR, settings) {
                                var self = this;
                                var xhr = settings.xhr;
                                settings.xhr = function () {
                                    var output = xhr();
                                    output.onreadystatechange = function () {
                                        if (typeof(self.readyStateChanged) == "function") {
                                            self.readyStateChanged(this);
                                        }
                                    };
                                    return output;
                                };
                            },
                            readyStateChanged: function (xhr) {
                                if (xhr.readyState == 4 && xhr.status == 200) {
                                    console.log("response", xhr.responseText);
                                    location.href = "#login";
                                    location.reload(); 
                                }else{
                                    return false;
                                }
                            },
                            url: "/api/maintenance/reset",
                            type: "POST",
                            dataType: "json",
                            data: {},
                            contentType: "application/json",
                            success: function(data, status, xhr) {
                                window.fw_upgrade = false;
                                document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                $("#refreshPage").removeClass("disable_a_href");
                            },
                            error: app.HTTPErrorHandler
                        });
                    } else if (window._video && window._video.running) {
                        window._video.sock.close();
                    } else if(location.hash=="#serial_over_lan"){
                        //if closed by top-right button, dont logout
                        if(window.opener!=null)
                        {
                            window.opener.$("#start").removeAttr("disabled");
                        }
                        return;
                    }else if(!window.settings){
                        console.log(window.settings);
                        //app.logout();
                        if(sessionStorage.getItem("garc") || sessionStorage.getItem("garc") != null){
                            app.logout(function() {
                                console.log("logout");
                                document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                app.router.navigate("login");
                                location.reload();
                            });
                        }
                    }
                };

                window.onhashchange = function(e) {
                    if (window.fw_upgrade) {
                        $("body").addClass("disable_a_href");
                        $.ajax({
                            url: "/api/maintenance/reset",
                            type: "POST",
                            dataType: "json",
                            data: {},
                            async: false,
                            contentType: "application/json",
                            success: function(data, status, xhr) {
                                window.fw_upgrade = false;
                                document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                $("#refreshPage").removeClass("disable_a_href");
                            },
                            error: app.HTTPErrorHandler
                        });
                    }
                };

                /*db.open({
                    server: 'bmc',
                    version: 1,
                    schema: {
                        ipmi_events: {
                            key: {
                                keyPath: 'id',
                                autoIncrement: false
                            },
                            indexes: {
                                timestamp: {
                                    unique: true
                                },
                                sensor_number: {},
                                sensor_name: {},
                                event_direction: {},
                                record_type: {},
                                system_software_type: {},
                                generator_type: {},
                                channel_number: {},
                                sensor_type: {},
                                event_description: {}
                            }
                        }
                    }
                }).done(function(s) {
                    context.db = s;

                    app.timer = setInterval(function() {
                        EventLogCollection.fetch({
                            success: function() {
                                EventLogCollection.trigger('loaded');
                            }
                        });
                    }, 5000);
                });*/





            },
            featureFilter: function(value) {
                if (!app.features) return;
                //hide features
                if (!value) value = "";
                var featureFlag,  notfeatureFlag = 0;
                $(value + " *[data-feature]").each(function(c, el) {
                    featureFlag = 0;
                    notfeatureFlag = 0;
                    $.each($(el).attr("data-feature").split(','), function(i, val) {
                       if(val.indexOf(";") != -1)
                       {    
                           var res = val.split(";");
                           for(var i=0; i<res.length;i++)
                           {    
                              if (app.features.indexOf(res[i]) != -1)
                              {    
                                  featureFlag = 0; 
                                  break;
                              }else{
                                 featureFlag = 1; 
                              }    
                           }    
                        }    
                        else 
                        {    
                            if (app.features.indexOf(val) == -1) featureFlag = 1; 
                        }
                    });
                    if($(el).attr("data-not-feature") !== undefined){
                        $.each($(el).attr("data-not-feature").split(','), function(i, val) {
                           if (app.features.indexOf(val) != -1) notfeatureFlag = 1;
                        });
                    }
                    if (featureFlag == 1) {
                        $(el).hide();
                    } else if (notfeatureFlag == 1) {
                        $(el).hide();
                    } else {
                        if ($(el).hasClass('hide') && !$(el).hasClass('help-item')) { $(el).removeClass('hide'); }
                        $(el).not('.help-item').show();
                    }
                });

                $(value + " *[data-not-feature]").each(function(c, el) {
                    notfeatureFlag = 0;
                    featureFlag = 0;
                    $.each($(el).attr("data-not-feature").split(','), function(i, val) {
                       if (app.features.indexOf(val) != -1) notfeatureFlag = 1;
                    });
                    if($(el).attr("data-feature") !== undefined){
                        $.each($(el).attr("data-feature").split(','), function(i, val) {
                           if(val.indexOf(";") != -1)
                           {
                               var res = val.split(";");
                               for(var i=0; i<res.length;i++)
                               {  
                                  if (app.features.indexOf(res[i]) != -1)
                                  {  
                                     featureFlag = 0;
                                     break;
                                  }else{
                                     featureFlag = 1;
                                  }
                               }
                            }
                            else
                            {  
                               if (app.features.indexOf(val) == -1) featureFlag = 1;
                            }
                        });
                    }
                    
                    if (notfeatureFlag == 1) {
                        $(el).hide();
                    } else if (featureFlag == 1) {
                        $(el).hide();
                    } else {
                        if ($(el).hasClass('hide') && !$(el).hasClass('help-item')) { $(el).removeClass('hide'); }
                        $(el).not('.help-item').show();
                    }
                });
            },
            checkboxnav:function(){
                            $('.icheckbox_square-blue input[type=checkbox]').focus(function(el){
                                $(this).parent().addClass("hover");
                            });
                            $('.icheckbox_square-blue input[type=checkbox]').focusout(function(){
                                $('.icheckbox_square-blue').removeClass("hover");
                            });
                           
            },
            radiobuttonnav:function(){
                            $('.iradio_square-blue input[type=radio]').focus(function(el){
                                $(this).parent().addClass("hover");
                            });
                            $('.iradio_square-blue input[type=radio]').focusout(function(){
                                $('.iradio_square-blue').removeClass("hover");
                            });
                           
            },
            listitemnav:function(){
                    $('.list-item a').focus(function(el) {
                        $(this).parent().css('border','1px solid #116da3');
                    });
                    $('.list-item a').focusout(function(el) {                         
                        $('.list-item, .delete').css('border','none');
                        $('.delete').parent().css('border','none');
                    });

            },
            licensesFilter:function(value){                
                if (!app.unLicensed) return;                
                if (!value) value = "";
                var licenseFlag;
                if (app.features.indexOf("RUNTIME_LICENSE") != -1) {                
                    $(value + " *[data-license]").each(function(c, el) {
                        licenseFlag = 0;
                        //console.log(el);
                        //console.log("total length"+$(el).attr("data-license").split(',').length);
                        $.each($(el).attr("data-license").split(','), function(i, val) {
                            if(app.unLicensed.indexOf(val) == 1 && val=="MEDIA" &&
                                app.unLicensed.match(/MEDIA/g).length !=3){
                                licenseFlag=0;    
                            } else {
                                if (app.unLicensed.indexOf(val) != -1) licenseFlag = 1;
                            }                            
                        });                        
                        if (licenseFlag == 1) {
                            $(el).hide();
                        } else {                            
                            if ($(el).hasClass('hide') && !$(el).hasClass('help-item')) { $(el).removeClass('hide'); }
                            $(el).not('.help-item').show();
                        }
                    });
                    $(value + " *[data-not-license]").each(function(c, el) {                        
                        if (app.unLicensed.indexOf($(el).attr("data-not-license")) != -1) {                            
                            $(el).hide();
                        } else {                            
                            if ($(el).hasClass('hide') && !$(el).hasClass('help-item')) { $(el).removeClass('hide'); }
                            $(el).not('.help-item').show();
                        }
                    });
                    var el=$('#main').find("[data-feature='" + "IMG_REDIRECTION" + "']");                      
                    var media_menu=$('#settings_media');
                    var media_unlicensed=false; 
                    if(el){                                             
                        if((app.unLicensed.indexOf("LMEDIA") == -1 && app.features.indexOf("LMEDIA") != -1) || 
                           (app.unLicensed.indexOf("RMEDIA") == -1 && app.features.indexOf("RMEDIA") != -1)){
                            el.show(); 
                        } else {                                                       
                            media_unlicensed=true;
                            el.hide();                         
                        }                       
                    }
                    if(media_unlicensed==true){
                        if(app.unLicensed.indexOf("KVM") != -1 &&
                            app.unLicensed.indexOf("MEDIA") != -1){
                            media_menu.addClass("hide");
                        }
                    }
                }
                
            },
            mediaGeneralFeatureFilter: function() {
                if((typeof sessionStorage.features !== 'undefined' && sessionStorage.features !== null)){
                    if (sessionStorage.features.indexOf("CD_SERVER_APP") != -1 && sessionStorage.features.indexOf("HD_SERVER_APP") != -1) {
                        $("#rmedia_same_settings").show();
                    }
                }
                app.mediaFeatureFilter();
            },

            mediaFeatureFilter: function() {
                if ((typeof app.features !== 'undefined' && app.features !== null) && (sessionStorage.features.indexOf("MEDIA_SERVER_NOT_AVAILABLE") != -1)) {
                    $("input[type='checkbox']").iCheck('disable');
                    app.disableAllbutton();
                    app.disableAllinput();
                    app.disableAlldropdown();
                    $(".alert-success").removeClass("hide").html(CommonStrings.t("common:media_server_not_available"));
                }
            },
            /*  
                        addLogs: function(model, collection) {
                            //console.log(model);
                            // this.db.ipmi_events.add(_.extend(model.toJSON(), {
                            //     mark_read: false
                            // }));
                            this.db.put('ipmi_events', _.extend(model.toJSON(), {
                                mark_read: 0
                            }));

                            EventLogCollection.trigger('added');

                            this.notify();

                        },

                        notify: function() {
                            this.db.from('ipmi_events').where('mark_read', '=', 0)
                                .list()
                                .done(function(results) {
                                    if (results.length) {
                                        $(".ipmi-log-count").show().removeClass("hide").html(results.length);
                                    } else {
                                        $(".ipmi-log-count").hide();
                                    }
                                });
                        },
            */
            showLoader: function () {
                $("#processing_layout").removeClass("hide-spinner");
                $("#processing_image").removeClass("hide-spinner");
            },
            hideLoader: function () {
                $("#processing_layout").addClass("hide-spinner");
                $("#processing_image").addClass("hide-spinner");
            },
            /*notify: function() {
                if (window.sessionStorage.getItem("LasteventID") == null) {
                    window.sessionStorage.setItem("LasteventID", EventLogCollection.length);
                    window.localStorage.setItem("LasteventID", EventLogCollection.length);
                }
                var updatedEventCount = EventLogCollection.length - window.sessionStorage.getItem("LasteventID");
                if (updatedEventCount > 0) {
                    var i = 0;
                    $(".ipmi-log-count").show().removeClass("hide").html(EventLogCollection.length);
                    EventLogCollection.each(function(model) {
                        if (model.get('id') > window.sessionStorage.getItem("LasteventID")) {
                            var SensorType = model.get("sensor_type");
                            MessageCollection.add(new MessageModel({
                                message: SensorType + " event occurred",
                                severity: "info"
                            }));
                        }
                    });
                    window.sessionStorage.setItem("LasteventID", EventLogCollection.length);
                    window.localStorage.setItem("LasteventID", EventLogCollection.length);
                } else {
                    $(".ipmi-log-count").hide();
                }
            },*/

            notify: function() {
                if (window.sessionStorage.getItem("newEventCount") == null || isNaN(window.sessionStorage.getItem("newEventCount"))) {
                    window.sessionStorage.setItem("newEventCount", 0);
                }
                var maxExistedEventCount = parseInt(app.LASTEVENTID);
                var newEventCount = parseInt(EventLogCollection.length);
                var allNewEventCount = parseInt(window.sessionStorage.getItem("newEventCount"));
                if (allNewEventCount > 0 && maxExistedEventCount != 0) {
                    $(".ipmi-log-count").show().removeClass("hide").html(allNewEventCount);
                    EventLogCollection.each(function(model) {
                        var SensorType = model.get("sensor_type");
                        MessageCollection.add(new MessageModel({
                            message: SensorType + " event occurred",
                            severity: "info"
                        }));
                    });
                } else {
                    $(".ipmi-log-count").hide();
                }
                if (newEventCount != 0 && maxExistedEventCount != 0) {
                    window.sessionStorage.setItem("newEventCount", (allNewEventCount + newEventCount));
                }
            },

            updateIDLedHeaderStatus: function(status) {
                $("#idled_status i").removeClass("text-info text-muted");
                if (status == 0) {
                    $("#idled_status i").addClass("text-muted");
                    $("#idled_status span").html(locale.t("idled_control:idled_off"));
                } else {
                    $("#idled_status i").addClass("text-info");
                    $("#idled_status span").html(locale.t("idled_control:idled_on"));
                }
            },

            updateSystemHealthHeaderStatus: function(status) {
                $("#system_status i").removeClass("text-success text-danger");
                if (status == 0) {
                    $("#system_status i").addClass("text-success");
                    $("#system_status span").html(locale.t("common:system_health_ok"));
                } else {
                    $("#system_status i").addClass("text-danger");
                    $("#system_status span").html(locale.t("common:system_health_critical"));
                }
            },

            updateChassisHeaderStatus: function(status) {
                $("#host_status i").removeClass("text-success text-muted");
                if (status == 1) {
                    $("#host_status i").addClass("text-success");
                    $("#host_status span").html(locale.t("common:online"));
                } else {
                    $("#host_status i").addClass("text-muted");
                    $("#host_status span").html(locale.t("common:offline"));
                }
            },

            clearPolls: function() {
                this.polling = false;
                //clearInterval(app.timer);
                //clearInterval(app.sensorTimer);
                clearInterval(app.ct2);
                app.ct2 = null;
                //clearInterval(app.ct5); //dont stop in sync click- chassis timer
                //app.ct5 = null;
                clearTimeout(app.ct10);
                app.ct10 = null;
                clearTimeout(app.ct15);
                app.ct15 = null;
            },
            clearFlashTrackPoll: function() {
                clearInterval(app.ct6); 
                app.ct6 = null;
            },
            clearChassisPoll: function() {
                // clearInterval(app.ct5); //need to stop a sync call- chassis status for firmware update.
                // app.ct5 = null;
                clearInterval(app.ct30);
                app.ct30 = null;
            },

            setPolls: function() {
                this.polling = true;
                if (typeof app.poll !== 'undefined' && app.poll !== null) {
                    if (!this.ct2) this.ct2 = setInterval(function () { app.poll.trigger('2sec'); }, 2000);
                    if (!this.ct5) this.ct5 = setInterval(function () { app.poll.trigger('5sec'); }, 5000);
                    //if (!this.ct6) this.ct6 = setInterval(function () { app.poll.trigger('6sec'); }, 6000);
                    if (!this.ct10) this.ct10 = setTimeout(function () { app.poll.trigger('10sec'); }, 10000);
                    if (!this.ct15) this.ct15 = setTimeout(function () { app.poll.trigger('15sec'); }, 15000);
                }
            },
            setFlashPoll:function(){
                this.polling = true;
                if (typeof app.poll !== 'undefined' && app.poll !== null) {
                    if (!this.ct6) this.ct6 = setInterval(function () { app.poll.trigger('6sec'); }, 6000);
                }
            },
            setChassisPoll: function() {
                this.polling = true;
                if (typeof app.poll !== 'undefined' && app.poll !== null) {
                    if (!this.ct30) this.ct30 = setInterval(function () { app.poll.trigger('30sec'); }, 30000);
                }

            },
            setFirmwareUpdatePoll: function() {
                app.poll.on('6sec', function() {
                    $.ajax({
                        url: "/api/maintenance/flashtrack",
                        type: "GET",
                        dataType: "json",
                        global: false,
                        success: function(data, status, xhr) {
                        },
                        error: function(xhr, status, err) {
                            window.fw_upgrade = false;
                            app.clearFlashTrackPoll();
                            localStorage.clear();
                            sessionStorage.clear();
                            document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            location.href = "#login";
                            location.reload();
                        }
                    });
                });
            },
            setBodyattr:function(){
                $("body").addClass("overflow");
            },
            initPollingEventHandlers: function() {
                app.poll.on('15sec', function() {
                    if(location.hash == "#dashboard" && $("#processing_layout").css("display") == "block")
                    {
                        if (app.polling)
                            app.ct15 = setTimeout(function() { app.poll.trigger('15sec'); }, 15000);
                    }
                    else
                    {
                        app.EventLogCollection.fetch({
                            data: $.param({
                                LASTEVENTID: app.LASTEVENTID
                            }),
                            global: false,
                            //timeout:6000, 
                            success: function() {
                                if (app.EventLogCollection.length > 0) {

                                    app.EventLogCollection.fetch({
                                        url: "/api/logs/dashboardevent",
                                        type: "GET",
                                        global: false,
                                        success: function() {
                                            var max = app.EventLogCollection.max(function(model) {
                                                return parseInt(model.get("id"))
                                            });
                                            app.LASTEVENTID = max.attributes.id;
                                            var pendingDeassertmodel = app.EventLogCollection.at(app.EventLogCollection.length-1);
                                            // $("#asserted-events-count").html(pendingDeassertmodel.get("pending_deassert"));
                                            app.EventLogCollection.trigger("loaded");
                                        }
                                    });
                                }
                                app.notify();
                                if (app.polling)
                                app.ct15 = setTimeout(function() { app.poll.trigger('15sec'); }, 15000);
                            },
                            error: function(){
                                if (app.polling)
                                app.ct15 = setTimeout(function() { app.poll.trigger('15sec'); }, 15000);
                            }
                        });

                        if (app.EventLogCollection.length > 0) {
                            app.totalEventRecords +=  app.EventLogCollection.length;
                        }
                    }

                });

                app.poll.on('10sec', function() {
                    if(location.hash.indexOf("#sensors") > -1 || location.hash.indexOf("#dashboard") > -1) {
                        var sensorURL = "api/sensors";
                        if(location.hash.indexOf("#sensors/") > -1 && location.href.split("/").length > 4){
                            sensorURL = "/api/detail_sensors_readings";
                        }
                        app.SensorCollection.fetch({
                            url:sensorURL,
                            global: false,
                            //timeout: 6000, 
                            success: function(collection) {
                                collection.each(function(model) {
                                    if (!app.readings) app.readings = {};
                                    if (!app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')]) {
                                        if(model.get('sensor_number') != undefined && model.get('owner_lun') != undefined){
                                        
                                            app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')] = [];
                                        }
                                        
                                    }
                                    app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].push({ reading: model.reading(), time: (new Date().getTime()) });

                                    if (app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].length > 50) {
                                        app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].shift();
                                    }
                                });
                            
                                app.SensorCollection.trigger("loaded");
                                if (app.polling)
                                app.ct10 = setTimeout(function() { app.poll.trigger('10sec'); }, 10000);
                            },
                            error: function(e){
                                if (app.polling)
                                app.ct10 = setTimeout(function() { app.poll.trigger('10sec'); }, 10000);
                            }
                        });
                    }else{
                        if (app.polling)
                        app.ct10 = setTimeout(function() { app.poll.trigger('10sec'); }, 10000);
                    }
                  /*else {
                        app.SensorCollection.fetch({
                            url:"/api/detail_sensors_readings",
                            type: "GET",
                            global: false,
                            timeout: 6000, 
                            success: function(collection) {
                                collection.each(function(model) {
                                    if (!app.readings) app.readings = {};
                                    if (!app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')]) {
                                        if(model.get('sensor_number') != undefined && model.get('owner_lun') != undefined){
                                            app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')] = [];
                                        }
                                    }
                                    app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].push({ reading: model.reading(), time: (new Date().getTime()) });

                            if (app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].length > 50) {
                                app.readings['sensor_' + model.get('sensor_number')+'_' + model.get('owner_lun')].shift();
                            }
                        });
                        app.SensorCollection.trigger("loaded");
                    },
                    error: function(e){}
                });
            }*/
        });

        app.poll.on('30sec', function () {
          app.Chassis.fetch({
            global: false
          });
        });
      },

      SessionStorage: function () {
        if (!sessionStorage.getItem("garc") || sessionStorage.getItem("garc") == null) {
          alert(CommonStrings.t("common:already_a_session_is_running_in_this_browser_so_opening_the_same_session"));
          var sessionStorageItems = [
            'extended_privilege',
            'features',
            'garc',
            'id',
            'kvm_access',
            'privilege',
            'privilege_id',
            'session_id',
            'since',
            'username',
            'vmedia_access',
            'features',
            'LasteventID',
            'BMC_Timezone'
          ];
          sessionStorageItems.forEach(function (item) {
            if (item != null) sessionStorage.setItem(item, localStorage.getItem(item));
          });
        }
      },

      logout_confirm: function () {
        var logout_confirm_msg = locale.t("common:logout_confirm_msg");
        // Get user confirmation before disposing KVM window.            
        if (localStorage.getItem('isActiveKVM')) {
          logout_confirm_msg = locale.t("common:active_kvm_logout_confirm_msg");
        }
        if (confirm(logout_confirm_msg)) {
          app.logout(function () {
            document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            app.router.navigate("dashboard");
            location.reload();
          });
        }
      },

      logout: function (callback) {
        app.trigger("beforeLogout");
        app.clearPolls();
        app.clearChassisPoll(); // Delete chassis poll to prevent creating a new web session after deleting old session
        var remember_chkbx = localStorage.getItem('remember_chkbx');
        var remember_usrname = localStorage.getItem('remember_usrname');
        localStorage.clear();
        localStorage.setItem('remember_chkbx', remember_chkbx);
        localStorage.setItem('remember_usrname', remember_usrname);
        var newEventCount = sessionStorage.getItem('newEventCount');
        sessionStorage.clear();
        sessionStorage.setItem('newEventCount', newEventCount);
        //   document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // '!' operator is used here
        // Which will check for empty strings (""), null, undefined, false and the numbers 0 and NaN
        if (!window.kvmWindow) { // if KVM window is not opened
          // if the value still exists in localStorage then clear it
          // !localStorage.getItem('isActiveKVM') will return false if the value is available already.
          if (!localStorage.getItem('isActiveKVM') == false) {
            localStorage.removeItem('isActiveKVM'); // delete the item
          }
        } else { // if KVM window is opened already
          if (!localStorage.getItem('isActiveKVM')) { // if video is not running
            window.kvmWindow.close(); // close the KVM window
          }
          delete window.kvmWindow; // delete the window variable. otherwise logout won't be done properly after closing the tab.
        }
        if (!window.solWindow) { }
        else {
          window.solWindow.close();
          delete window.solWindow;
        }

                // Latest version 80 of Chrome browser disallows sync XHR in page dismissal.
                var is_async = window.navigator.userAgent.indexOf('Chrome') != -1 ? true : false;
                $.ajax({
                    url: "/api/session",
                    type: "DELETE",
                    async: is_async,
                    success: callback,
                    error: function(data,error) {
                        if(callback){
                            callback();
                        }
                        
                        try {
                             throw new Error("Cannot perform a clean logout");
                        }
                        catch(error) {
                           console.log("Cannot perform a clean logout")
                        }
                        
                      //  throw new Error("Cannot perform a clean logout");
                    }
                });
            },

            blockAnchors: function() {
                $("a").each(function() {
                    if ($(this).attr('id') != "sidebar-toggle" && $(this).attr('id') != "rightsidebar-toggle" && $(this).attr('id') != "start" && $(this).attr('id') != "refreshPage" && $(this).attr('id') != "live-poll" && window.fw_upgrade != false) {
                        $(this).off('click').on('click',function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            alert(CommonStrings.t("common:flashing_alert"));
                        });
                    }
                });
            },

            confirmMediaNavigation: function() {
                $("a").click(function(event) {
                    if (!$(this).parents().hasClass("content") && window.cdrom) {
                        alert(CommonStrings.t("common:media_nav_alert"));
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
            },

            cancelConfirm: function() {            
                window.fw_upgrade = false;
                $("a").unbind();
                $("#refreshPage").bind("click", app.refreshfunction);
                $("#live-poll").bind("click", app.syncfunction);   
                $("#sidebar-toggle").bind("click", app.sidebarTogglefunction);
                $("#rightsidebar-toggle").bind("click", app.sidebarrightTogglefunction);
                $(".sidebar .treeview").tree();
                $(".treeview ul li a").css("margin-left", "10px")
                $("#idQuicklinks").removeAttr("disabled", "disabled");
                $("#select_lang_top").removeAttr("disabled", "disabled");
            },

            bindLanguageTop: function () {
                if (localStorage.select_lang != undefined) {
                    $('#select_lang_top').val(localStorage.select_lang);
                    $('.sidebar-menu li').removeClass('active');
                    $("a[href='" + location.hash + "']").parentsUntil('.sidebar-menu', 'li').addClass('active');

                    var that = this;
                    if (location.hash != "#login" && location.hash != "#serial_over_lan") {
                        this.Chassis.fetch({
                            type: 'GET',
                            success: function (response) {
                                this.updateChassisHeaderStatus(that.Chassis.get('power_status'));
                                this.updateIDLedHeaderStatus(that.Chassis.get('led_status'));
                                this.updateSystemHealthHeaderStatus(that.Chassis.get('system_status'));
                                app.initPollingEventHandlers();

                            }
                        });
                    }
                }else{
                    if(app.selected_language){
                        $('#select_lang_top').val(window.navigator.language);  
                    }else{
                        $('#select_lang_top').val("en-US");  
                    }
                }
            },

            refreshfunction : function(ev){            
                if(!$("#refreshPage").hasClass("disable_a_href")){
                    ev.stopPropagation();
                    ev.preventDefault();                    
                    var refreshURL = location.hash;
                    /*if (refreshURL.indexOf("#settings") > -1) {
                                    window.settings = true;
                                    location.reload();
                                } else {
                                    if (Backbone.history.fragment == "logout") {
                                        window.history.back();
                                    }
                                    if (Backbone.history.fragment == "remote-control") {
                                        alert(CommonStrings.t("common:disable_refresh"));
                                    } else {
                                        Backbone.history.loadUrl(Backbone.history.fragment);
                                    }
                                }*/
                    if(Backbone.history.fragment == "logout"){
                        window.history.back();
                    }
                    if(Backbone.history.fragment == "remote-control"){
                        alert(CommonStrings.t("common:disable_refresh"));
                    }
                    else{
                        Backbone.history.loadUrl(Backbone.history.fragment);
                    }
                }
            },
            syncfunction: function(ev){
                ev.stopPropagation();
                ev.preventDefault();
                if ($("#live-poll").data("poll") == "on") {
                    $("#live-poll").data("poll", "off");
                    $("#live-poll").find("i").css("color", "gray");
                    app.clearPolls();
                    app.manualStopPoll = true;
                } else {
                    $("#live-poll").data("poll", "on");
                    $("#live-poll").find("i").css("color", "deepskyblue");
                    app.setPolls();
                    app.manualStopPoll = false;
                }
            },

            sidebarTogglefunction: function(e){
                e.preventDefault();
                $(".row-offrightcanvas").removeClass("hide");
                //If window is small enough, enable sidebar push menu
                $(".left-side").toggleClass("hide");

                $('.row-offcanvas').toggleClass('active');
                $('.left-side').removeClass("collapse-left");
                if ($('.left-side').hasClass("hide")) {
                    $(".right-side").addClass("strech");
                } else {
                    $(".right-side").removeClass("strech");
                }

                // if ($(window).width() <= 992) {
                //     if (!$('.row-offcanvas').hasClass("relative")) {
                //         $('.row-offcanvas').addClass("relative");
                //         $(".left-side").toggleClass("hide");
                //     }
                //     $('.row-offcanvas').toggleClass('active');
                //     $('.left-side').removeClass("collapse-left");
                //     $(".right-side").removeClass("strech");
                // } else {
                //     //Else, enable content streching
                //     $('.left-side').toggleClass("collapse-left");
                //     $(".right-side").toggleClass("strech");
                // }
            },

            // sidebarrightTogglefunction: function(e){
            //     e.preventDefault();
            //     //If window is small enough, enable sidebar push menu
            //     if ($(window).width() <= 892) {
            //         if (!$('.row-offcanvas').hasClass("relative")) {
            //             $('.row-offcanvas').addClass("relative");
            //         }
            //         $('.row-offcanvas').toggleClass('active');
            //         $('.left-side').removeClass("collapse-left");
            //         $(".right-side").removeClass("strech");
            //         if($(".row-offcanvas").hasClass("active")){
            //             $(".row-offrightcanvas").addClass("hide");
            //         }else{
            //             $(".row-offrightcanvas").removeClass("hide");
            //         }
            //     } else {
            //         //Else, enable content streching
            //         $('.left-side').toggleClass("collapse-left");
            //         $(".right-side").toggleClass("strech");
            //         if($(".row-offrightcanvas").hasClass("hide")){
            //             $(".row-offrightcanvas").removeClass("hide")
            //         }
            //     }
            // },

            isAdmin: function() {
                console.log("isAdmin function", sessionStorage.privilege_id);
                console.log("isAdmin function", CONSTANTS["ADMIN"]);
                return (sessionStorage.privilege_id == CONSTANTS["ADMIN"]);
            },
            isOperator: function() {
                return (sessionStorage.privilege_id == CONSTANTS["OPERATOR"]);
            },
            isUser: function() {
                return (sessionStorage.privilege_id == CONSTANTS["USER"]);
            },

            isKVM: function() {
                return parseInt(sessionStorage.kvm_access) ? true : false;
            },

            isVMedia: function() {
                return parseInt(sessionStorage.vmedia_access) ? true : false;
            },
            urlPath: function() {
                var protocol = location.protocol;
                var hostname = location.hostname;
                var port = location.port;
                //Urlpath should have port number too
                return (port != "") ? (protocol + "//" + hostname + ":" + port + "/") : (protocol + "//" + hostname + "/");
            },
            currentSessionId: function() {
                return sessionStorage.session_id;
            },
            isFeatureEnabled: function(fname) {
                return (typeof sessionStorage.features !== 'undefined' && sessionStorage.features !== null && sessionStorage.features.indexOf(fname) > -1) ? true : false;
            },
            //Hide Page Constraints
            hidePage: function() {
                alert(CommonStrings.t("common:non_privilege_user_error_message"));
                var redirectURL = location.hash;
                if (redirectURL.indexOf("maintenance") > -1) {
                    location.href = "#maintenance";
                } else if (redirectURL.indexOf("settings") > -1) {
                    location.href = "#settings";
                } else {
                    location.href = "#dashboard";
                }
            },
            disableAllbutton: function() {
                $(".content .btn").each(function() {
                    $(this).addClass("disable_a_href");
                });
                $(".content .delete").each(function() {
                    $(this).addClass("disable_a_href");
                });
            },
            disableAllinput: function() {
                $("input").attr('disabled', 'disabled');
            },
            disableAlldropdown: function() {
                
                $("select").not("#idQuicklinks,#select_lang_top").attr('disabled', 'disabled');
            },
            logslimscroll: function() {
                $(".logscroll").slimscroll({
                    height: "450px",
                    width:"96%",
                    alwaysVisible: true,
                    size: "3px"
                });
            },
            helpContentCheck: function(e, pageObject) {
                e.preventDefault();
                var help_items = pageObject.$('.help-item').filter(function() {
                    featureFlag = 0;
                    notfeatureFlag = 0
                    var f = $(this).data('feature');
                    var nf = $(this).data('not-feature');
                    if (f) {
                        $.each(f.split(','), function(i, val) {
                            if (app.features.indexOf(val) == -1) featureFlag = 1;
                        });
                        return (featureFlag == 1 ? false : true);
                    } else if (nf) {
                        $.each(nf.split(','), function(i, val) {
                            if (app.features.indexOf(val) == -1) notfeatureFlag = 1;
                        });
                        return (notfeatureFlag == 1 ? true : false);
                    } else {
                        return true;
                    }
                });
                pageObject.$(".tooltip").hide();
                if (help_items.hasClass('hide')) {
                    help_items.removeClass('hide');
                } else {
                    help_items.addClass('hide');
                }

            },
            validateKeyCodes: function(e){
                var code = e.keyCode || e.which;
                var defaultCodes = [8, 46, 37, 38, 39, 40, 13, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
                if($(e.target).hasClass('numberOnly')){
                    var regex = new RegExp("^[0-9]+$");
                    var str = String.fromCharCode(code);
                    if(e.shiftKey && code >= 48 && code <= 57){
                        e.preventDefault();
                    }
                    else if(!(regex.test(str) || ($.inArray(code, defaultCodes) !== -1))){
                        e.preventDefault();
                    }
                }
            }

        };


        app.HTTPErrorHandler = HTTPErrorHandler;

        //Templates
        window.JST = {};
        window.JST["app/templates/layouts/main.html"] = template(MainTemplate);
        window.JST["app/templates/layouts/login.html"] = template(LoginTemplate);
        window.JST["app/templates/layouts/withoutmenu.html"] = template(WithoutMenuTemp);

        // Localize or create a new JavaScript Template object.
        var JST = window.JST = window.JST || {};

        // Configure LayoutManager with Backbone Boilerplate defaults.
        Layout.configure({
            // Allow LayoutManager to augment Backbone.View.prototype.
            manage: true,

            prefix: "app/templates/",

            fetchTemplate: function(path) {
                // Initialize done for use in async-mode
                var done;
                // Concatenate the file extension.
                path = path + ".html";

                // If cached, use the compiled template.
                if (JST[path]) {
                    return JST[path];
                } else {
                    // Put fetch into `async-mode`.
                    done = this.async();

                    // Seek out the template asynchronously.
                    return $.ajax({
                        url: app.root + path
                    }).then(function(contents) {
                        done(JST[path] = template(contents));
                    });
                }
            }
        });

        // Mix Backbone.Events, modules, and layout management into the app object.
        return _.extend(app, {
                // Create a custom object with a nested Views object.
                module: function(additionalProps) {
                    return _.extend({
                        Views: {}
                    }, additionalProps);
                },

                layout: new Layout({}),

                // Helper for using layouts.
                useLayout: function(name, options) {
                    // If already using this Layout, then don't re-inject into the DOM.
                    if (this.layout && this.layout.options.template === name) {
                        return this.layout;
                    }

                    // If a layout already exists, remove it from the DOM.
                    if (this.layout) {
                        this.layout.remove();
                    }

                    var _app = this;

                    // Create a new Layout with options.
                    var layout = new Layout(_.extend({
                        template: name,
                        //className: "layout " + name,
                        //id: "layout",

                        afterRender: function () {
                            app.ischecked = false;
                            $("#dashboardWidget").click(function () {
                                app.ischecked = $(this).is(':checked');
                                Backbone.history.loadUrl(Backbone.history.fragment);
                            });

                        // Calling for language retain in Dropdown box
                        $(".logo").html(app.brand_title);
                        app.selected_language = false;
                        
                        for (var languages in supportedlanguages.languages) {
                            if(languages == window.navigator.language){
                                app.selected_language = true;
                            }
                            if (!supportedlanguages.languages[languages]) {
                                $("#" + languages).remove();
                            }
                        }
                        
                        app.bindLanguageTop();

                            


                            var routerLink = _app.router.routes;
                        
                             var autorouterLink;
                            if(_app.auto_router != undefined )
                             autorouterLink = _app.auto_router.routes;
                            var quickLinks = $.extend({}, routerLink, autorouterLink);
                            var unwantedLinks = "#remote-control#updates#help#login#logout#settings/sensor_thresholds#settings/service_sessions#store#";

                            if(_app.fpx_router != undefined )
	                            quickLinks = $.extend({}, quickLinks, _app.fpx_router.routes);
                                
                            // $.each(quickLinks, function(key, value) {
                            //     if(key.indexOf("/:") == -1 && unwantedLinks.indexOf("#"+key+"#") == -1){
                            //         var links = key.replace(/\//g," ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/\s/g," > ").replace(/[_-]/g," ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                            //         $('#idQuicklinks').append('<option value="' + key + '">' + links + '</option>');
                            //     }
                            // });
                            
                            $('#select_lang_top').select2();

                            $("#idQuicklinks").select2({
                                placeholder: "Quick Links..",
                                width:"100%"
                            }).on("select2:open", function(){
                                console.log("select2 open");
                                $(".select2-results__options").slimscroll({
                                    color: "#FFF",
                                    railVisible: true,
                                    railColor: '#000'
                                });
                                $(".select2-results__options").css({
                                    height: "250px"
                                });
                            }).on("select2:select", function(e){
                                _app.router.navigate($("#idQuicklinks").select2('val'), {
                                    trigger: true
                                });
                            });

                            $("[data-toggle='dropdown']").dropdown();

                            //$("body").addClass("fixed");

                            //TODO : Fix any leaks
                            //Enable sidebar toggle
                            $("[data-toggle='offcanvas']").click(function(e) {
                                app.sidebarTogglefunction(e);                                
                            });

                            $("[data-toggle='offrightcanvas']").click(function(e) {
                                app.sidebarrightTogglefunction(e);                                
                            });

                            /*
                             * ADD SLIMSCROLL TO THE TOP NAV DROPDOWNS
                             * ---------------------------------------
                             */
                            $(".navbar .menu").slimscroll({
                                height: "200px",
                                alwaysVisible: false,
                                size: "3px"
                            }).css("width", "100%");

                            $('.sidebar-menu a').bind('touchstart', function() {
                                var el = $(this);
                                var link = el.attr('href');                    
                                if(link == "#logs"){
                                    $("a[href='#logs']").click();
                                }
                                window.location = link;

                            });
                            
                            //add tabindex attribute in sidebar menu
                            $(".sidebar-menu li a").each(function (i) { 
                                $(this).attr('tabindex', i + 1); 
                            });

                            //Set sidebar tree
                            $(".sidebar .treeview").tree();

                            _app._fix();
                            //Fire when wrapper is resized
                            $(".wrapper").resize(function() {
                                console.log("resizing...");
                                _app._fix();
                            });

                            //Fix for charts under tabs
                            $('.box ul.nav a').on('shown.bs.tab', function(e) {
                                area.redraw();
                                donut.redraw();
                            });

                            //Add slimscroll
                            $(".sidebar").slimscroll({
                                height: ($(window).height() - $(".header").height()) + "px",
                                color: "#FFF",
                                railVisible: true,
                                railColor: '#000000'
                            });
                            $("#live-poll").click(function(ev) {
                                app.syncfunction(ev);
                             })
                            $("#bios_popup").click(function(ev) {
                                ev.stopPropagation();
                                ev.preventDefault();
                                var strpath = app.urlPath() + "bios/Index.html";
                            	$.ajax({ 
 	 		                                    url: strpath, 
 	 		                                    type: "HEAD", 
 	 		                                    success: function(data, status, xhr) { 
 	 		                                        window.open(strpath); 
 	 		                                    }, 
 	 		                                    error: function(data, status, xhr) { 
													                    alert(CommonStrings.t("common:bios_configuration_files_not_available"));
 	 		                                        return; 
 	 		                                    } 
 	 		                                });	
							})


                            $("#refreshPage").click(function(ev) {
                                app.refreshfunction(ev);                            
                            })
                            $("#logout , #logout_sidebar").click(function(ev) {                            	
                                app.logout_confirm(ev);                            
                            })                            
                            $('.var_profile_href').attr('href','#settings/users/edit/'+window.sessionStorage.getItem('id'))

                           
                            $("#select_lang_top").change(function (ev) {
                                localStorage.select_lang = $('#select_lang_top').val();

                                var storedLocales = window.navigator.languages ? window.navigator.languages[0] : null;
                                storedLocales = (storedLocales || window.navigator.language || window.navigator.browserLanguage).toLowerCase(); //For Browser support
                                var ua = window.navigator.userAgent;
                                var msie = ua.indexOf("MSIE ");
                                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
                                {
                                    storedLocales = navigator.userLanguage.toLowerCase();
                                }


                                var temp = function () {
                                    window.curLng = storedLocales;
                                }

                                var userLanguage = localStorage.select_lang;

                                if (userLanguage != undefined) {
                                    i18next.setLng(userLanguage, i18next.options, temp);
                                    _app.layout.render();
                                    _app.clearPolls();
                                    _app.clearChassisPoll();
                                    _app.AfterRenderHitted = false;
                                    _app.initialize();
                                } else {
                                    i18next.setLng(storedLocales, i18next.options, temp);
                                    _app.layout.render();
                                    _app.clearPolls();
                                    _app.clearChassisPoll();
                                    _app.AfterRenderHitted = false;
                                    _app.initialize();
                                }
                            })
                            setTimeout(function(){
                                $( "#live-poll" ).trigger( "click" );
                           },100);
                        }
                    }, options));

                    // Insert into the DOM.
                    $("#main").empty().append(layout.$el);

                    // Render the layout.
                    layout.render();

                    // Cache the refererence.
                    this.layout = layout;

                    // Return the reference, for chainability.
                    return layout;
                },

                /* 
                 * Make sure that the sidebar is streched full height
                 * ---------------------------------------------
                 * We are gonna assign a min-height value every time the
                 * wrapper gets resized and upon page load. We will use
                 * Ben Alman's method for detecting the resize event.
                 **/
                //alert($(window).height());
                _fix: function() {
                    //Get window height and the wrapper height
                    // var height = $(window).height() - $("body .header").height();
                    // $(".wrapper").css("min-height", height + "px");
                    // var content = $(".wrapper").height();
                    //If the wrapper height is greater than the window
                    // if (content > height)
                    // //then set sidebar height to the wrapper
                    //     $(".left-side, html, body").css("min-height", content + "px");
                    // else {
                    //     //Otherwise, set the sidebar to the height of the window
                    //     $(".left-side, html, body").css("min-height", height + "px");
                    // }
                    if($(window).width() < 561){
                        if ($('.left-side').hasClass("hide")) {
                            $(".navbar-nav").removeClass("hide");
                        } else {
                            $(".navbar-nav").addClass("hide");
                        }
                        $("#navbar_logo").addClass("hide");
                    }else{
                        $(".navbar-nav").removeClass("hide");
                        $("#navbar_logo").removeClass("hide");
                    }

                    // if($(window).width() >= 876){
                    //     $("#rightsidebar-toggle").addClass("hide");
                    //     $("#sidebar-toggle").removeClass("hide");
                    //     $(".row-offrightcanvas").removeClass("hide");
                    // }else{
                    //     $("#sidebar-toggle").addClass("hide");
                    //     $("#rightsidebar-toggle").removeClass("hide");
                    //     if($(".row-offcanvas-left").hasClass("active")){
                    //         $(".row-offrightcanvas").addClass("hide");
                    //     }else{
                    //         $(".row-offrightcanvas").removeClass("hide");
                    //     }
                    // }
                },
            },

            Backbone.Events);

    });
