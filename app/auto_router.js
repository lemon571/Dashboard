define(["app", "views/MessagesView", "resize", "treeview", "slimscroll"],

  function (
    //##views-name-list
    app, MessagesView) {
    "use strict";


    // Defining the application router.
    var Router = Backbone.Router.extend({

      routes: {
        
        //##views-routes
        "": "default"
      },
      routerfeatures: {

        //##view-features-routes
        "": "default"

      },

      default: function () {
        this.navigate("dashboard", {
          trigger: true
        });
        console.log("Moving to dashboard");
      },

     
      preSwitch: function () {
        if (app.lastActiveView) {
          if (app.lastActiveView.timer) clearInterval(app.lastActiveView.timer);
          app.lastActiveView.trigger("close");
        }

        // if (!document.cookie) {
        //   this.navigate("dashboard", {
        //     trigger: true
        //   });
        //   
        // }

        if (!app.afterLoginInit) {
          app.afterLoginInit = true;
          new MessagesView().render().$el.prependTo(".navbar-nav");
          app.initPollingEventHandlers();
        }
      },

      postSwitch: function () {
        $('.sidebar-menu li').removeClass('active');
        $("a[href='" + location.hash + "']").parentsUntil('.sidebar-menu', 'li').addClass('active');
        $(".content input:text, .content textarea,.content form:first *:input[type!=hidden],.content a,.content button").first().focus();
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

        //To hightlight check boxes on tab navigation.
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
        var view = new View();

        app.layout.setView(".right-side", view).render();
        app.lastActiveView = view;
      }

    });

    return Router;
  });
