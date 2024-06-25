define(["views/DashboardView",
    "views/LoginView",
    "views/EventLogView",
    "views/AuditLogView",
    "views/PowerControlView",
    "views/IDLEDControlView",
    "views/HelpView",
    "app", "resize", "treeview", "slimscroll"],
    function (DashboardView,
        LoginView,
        EventLogView,
        AuditLogView,
        PowerControlView,
        IDLEDControlView,
        HelpView,
        app) {
        "use strict";


        // Defining the application router.
        var Router = Backbone.Router.extend({

            routes: {
                "login": "login",
                "logout": "logout",
                "dashboard": "dashboard",
                "logs/event-log": "eventLog",
                "logs/event-log/:filter": "eventLog",
                "logs/audit-log": "auditLog",
                "power-control": "powerControl",
                "idled-control": "idledControl",	//nick20190522 idled

                "help": "help",

                "": "default"
            },

            routerfeatures: {

            },


            default: function () {
                this.navigate("dashboard", {
                    trigger: true
                });
                console.log("Moving to dashboard");
            },

            login: function () {
                // if (localStorage.getItem("garc") != null) {
                //     app.router.navigate("dashboard", {
                //         trigger: true
                //     });
                // } else {
                //     app.useLayout("layouts/login");
                //     app.layout.setView(".login-view", new LoginView()).render();
                // }

                app.router.navigate("dashboard");
            },

            logout: function () {
                var logout_confirm_msg = locale.t("common:logout_confirm_msg");
                // Get user confirmation before disposing KVM window.
                if (localStorage.getItem('isActiveKVM')) {
                    logout_confirm_msg = locale.t("common:active_kvm_logout_confirm_msg");
                }
                if (confirm(logout_confirm_msg)) {
                    app.logout(function () {
                        document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        app.router.navigate("login");
                        location.reload();
                    });
                } else {
                    if (Backbone.history.fragment == "logout") {
                        window.history.back();
                    } else {
                        Backbone.history.loadUrl(Backbone.history.fragment);
                    }
                }
            },

            dashboard: function (event) {
                this.preSwitch();

                this.setView(DashboardView);

                /*switch (event) {
                        case "event-month":
    
                            break;
                        case "event-week":
    
                            break;
                    }
    */
                this.postSwitch();
                console.log("dashboard router done");
                //this.navigate("user-login", {trigger: true});
            },

            eventLog: function (filter) {
                this.preSwitch();
                this.setView(EventLogView);
                this.postSwitch();
            },

            auditLog: function () {
                this.preSwitch();
                this.setView(AuditLogView);
                this.postSwitch();
            }, powerControl: function () {
                this.preSwitch();
                this.setView(PowerControlView);
                this.postSwitch();
            },

            idledControl: function () {
                this.preSwitch();
                this.setView(IDLEDControlView);
                this.postSwitch();
            },

            help: function () {
                this.preSwitch();
                this.setView(HelpView);
                this.postSwitch();
            },

            preSwitch: function () {
                if (app.lastActiveView) {
                    if (app.lastActiveView.timer) clearInterval(app.lastActiveView.timer);
                    app.lastActiveView.trigger("close");
                }

                if (window._video && window._video.running) {
                    window._video.sock.close();
                }

                // Stop requests from a dashboard page
                if (app.dahsboard_system_status_interval_id != undefined && app.dahsboard_system_status_interval_id != null) {
                    clearInterval(app.dahsboard_system_status_interval_id);
                    app.dahsboard_system_status_interval_id = null;
                }

                //if (!document.cookie) {
                var Cookiename = "refresh_disable";
                var myCookie = 0;
                var nameEQ = Cookiename + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) {
                        myCookie = c.substring(nameEQ.length, c.length);
                    }
                }

                if (myCookie == 0) {
                    /*this.navigate("dashboard", {
                        trigger: true
                    });*/
                    app.router.navigate("dashboard");


                }/*else{
                if(!sessionStorage.getItem("garc") || sessionStorage.getItem("garc") == null){
                    app.logout();
                    document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    app.router.navigate("dashboard");
                    
                }
            }*/


            },

           postSwitch: function () {
                $(".content input:text, .content textarea,.content form:first *:input[type!=hidden],.content a,.content button").first().focus();
                $('.sidebar-menu li').removeClass('active');
                $("a[href='" + location.hash + "']").parentsUntil('.sidebar-menu', 'li').addClass('active');

                if (!app.polling && !app.manualStopPoll) {
                    app.setPolls();
                }

                if (!app.afterLoginInit) {
                    app.afterLoginInit = true;
                    //app.layout.setView(".notifications-menu", new NotificationsView()).render();
                    //app.layout.setView(".messages-menu", new MessagesView()).render();
                    //new UserTasksView().render().$el.prependTo(".navbar-nav");

                    app.initPollingEventHandlers();

                }
                setTimeout(function () {
                    app.featureFilter();
                }, 100);

                app.licensesFilter();

                //invoke only Media instance,Remotesession screens.
                if ((location.hash.indexOf("instance") > -1) || (location.hash.indexOf("remote_session") > -1)) {
                    app.runtime_configurations.fetch({
                        success: function () {
                            app.runtimeFeatureFilter();
                        }
                    });
                }


                //To hightlight check boxes and radio button on tab navigation.
                if ($(".icheckbox_square-blue").length > 0) {
                    app.checkboxnav();
                }
                if ($(".iradio_square-blue").length > 0) {
                    app.radiobuttonnav();
                }
                //check and close log tree
                if (location.hash.indexOf('#logs') == -1) {
                    if ($("a[href='#logs']").find(".fa-angle-down").length !== 0) {
                        $("a[href='#logs']").click();
                    }
                }
                if ($(window).width() <= 992) {
                    if ($(".row-offcanvas-left").hasClass("active")) {
                        $("[data-toggle='offcanvas']").click();
                    }
                }
                // Dashboard Toggle button show/hide
                if (location.hash == "#dashboard" && app.DASHBOARD_WIDGET) {
                    $('.widget_on_off').removeClass("hide")
                } else {
                    $('.widget_on_off').addClass("hide")
                }
            },

            setView: function (View) {
                $(document).ready(function () {
                    var view = new View();

                    app.layout.setView(".right-side", view).render();
                    app.lastActiveView = view;
                });
                /*if (this.loaded !== true) {
                        this.loaded = true;
                    } else {
                        app.layout.setView(".right-side", new View()).render();
                    }*/
            }

        });

        return Router;
    });
