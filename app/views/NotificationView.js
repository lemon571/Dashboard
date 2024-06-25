define(['jquery', 'underscore', 'backbone',
	//localize
	'i18n!:common',
	//template
	'text!templates/notification.html'],
	function ($, _, Backbone, CommonStrings, NotificationTemplate) {

		var view = Backbone.View.extend({

			tagName: "li",

			template: template(NotificationTemplate),

			initialize: function () {

				this.model.on("destroy", this.remove, this);

			},
			afterRender: function () {
				this.$(".href_notification_var").attr('href', '#notifications/'+this.model.get('id'));
				this.$(".class_notifications_var").addClass(this.mapIcon(this.model.get('message_group')) +' '+ this.model.get('severity'));
				this.$(".var_notification_messgae").html(this.model.get('message'));
			},

			remove: function () {
				this.$el.remove();
			},

			mapIcon: function (group) {
				var icon = "";
				switch (group) {
					default:
						icon = "fa fa-warning";
				}
				return icon;
			},

			serialize: function () {
				return {
					id: this.model.get('id'),
					icon: this.mapIcon(this.model.get('message_group')),
					message: this.model.get('message'),
					severity: this.model.get('severity') //success, warning, info, danger
				}
			}

		});

		return view;

	});