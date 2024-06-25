define(['jquery', 'underscore', 'backbone', 'cc',
        'collection/notifications',
        'views/NotificationView',
        'i18n!:common',
        'text!templates/navbar-notifications.html',
        //plugins
        "dropdown","slimscroll","notify"
    ],
    function($, _, Backbone, CC, NotificationCollection, NotificationView, CommonStrings, HolderTemplate) {

        var view = Backbone.View.extend({

            tagName: "li",

            template: template(HolderTemplate),
            //el: '.notifications-menu',

            initialize: function() {

                this.collection = NotificationCollection;

                this.collection.on("add", this.addNotification, this);
                this.collection.on("all add reset remove", this.updateCount, this);

            },

            beforeRender: function() {
                this.$el.addClass("dropdown notifications-menu");
                //this.collection.fetch();
                //this.collection.reset();
                //this.$(".label-warning").hide();
            },

            afterRender: function() {
                console.log("render notify", this.$el);
                this.$("[data-toggle='dropdown']").dropdown();
                this.collection.reset();
            },

            addNotification: function(model) {
                // this.insertView(".menu", new NotificationView({
                //     model: model
                // })).render();
                (new NotificationView({model:model})).render().$el.prependTo(this.$(".menu"));
                this.$el.notify(model.get("message"), {className: CC.NOTIFY_MAP[model.get("severity")], position: "bottom left"});
                //console.log(view);
                //view.$el.appendTo(this.$(".menu"));
                //manually prepend the glyphicon icon due to csp issue
                $('.glyphicon-exclamation-sign').remove();
                $('.notifyjs-bootstrap-base.notifyjs-bootstrap-error').prepend('<span class="glyphicon glyphicon-exclamation-sign glyphicon_dangericon_adjust"></span>');
            },

            updateCount: function(model, collection, options) {
                this.$(".count").html(this.collection.length);
                //console.log("notifications", this.collection.length);
                if (this.collection.length > 0) {
                    this.$(".label-warning").show();
                } else {
                    this.$(".label-warning").hide();
                }

                this.$(".menu").slimscroll({
                    height: "200px",
                    alwaysVisible: false,
                    size: "3px"
                }).css("width", "100%");
            },

            serialize: {
                locale: CommonStrings
            }

        });

        return view;

    });
