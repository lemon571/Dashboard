define(['jquery', 'underscore', 'backbone','app','cc',
        'collection/messages',
        'views/MessageView',
        'i18n!:common',
        'text!templates/navbar-messages.html',
        //plugins
        "dropdown", "slimscroll"
    ],
    function($, _, Backbone, app,CC, MessageCollection, MessageView, CommonStrings, HolderTemplate) {

        var view = Backbone.View.extend({

        	tagName: "li",

            template: template(HolderTemplate),
            //el: '.messages-menu',

            initialize: function() {

                this.collection = MessageCollection;

                this.collection.on("add", this.addMessage, this);
                this.collection.on("all add reset remove", this.updateCount, this);

            },
            events: {
            "click #messages": "navigate",
            },

            beforeRender: function() {
                this.$el.addClass("dropdown messages-menu");
            	//this.collection.fetch();
                //this.$(".label-warning").hide();
            },

            afterRender: function() {
                this.$("[data-toggle='dropdown']").dropdown();
            	this.collection.reset();
            },

            addMessage: function(model) {
                // this.insertView(".menu", new MessageView({
                //     model: model
                // })).render(); //.$el.appendTo(this.$(".menu"));
        		(new MessageView({model: model})).render().$el.prependTo(this.$(".menu"));
                this.$el.notify(model.get("message"), {className: CC.NOTIFY_MAP[model.get("severity")], position: "bottom left"});
                //manually prepend the glyphicon icon due to csp issue
                $('.glyphicon-info-sign').remove();
                $('.notifyjs-bootstrap-base.notifyjs-bootstrap-info').prepend('<span class="glyphicon glyphicon-info-sign glyphicon_dangericon_adjust"></span>');
            },
            navigate: function(){
              _.invoke(MessageCollection.toArray(), 'destroy');
              var refreshURL = location.hash;
              if(refreshURL.indexOf("#logs/event-log")>-1){
                $( "#refreshPage" ).trigger( "click" );
              }else{
                app.router.navigate("logs/event-log", {trigger: true });
              }
            },
            updateCount: function(model, collection, options) {
                this.$(".count").html(this.collection.length);
                //console.log("messages", this.collection.length);
                if (this.collection.length > 0) {
                    this.$(".label-success").show();
                } else {
                    this.$(".label-success").hide();
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
