define(['jquery', 'underscore', 'backbone', 'app',
        //data
        'models/idled_status',
        'i18n!:idled_control',
        //template
        'text!templates/idled-control.html',
        //plugins
        'iCheck', 'tooltip', 'alert'
    ],

    function($, _, Backbone, app, IDLEDModel, locale, IDLEDTemplate) {

        var view = Backbone.View.extend({

            template: template(IDLEDTemplate),

            initialize: function() {
                this.model = IDLEDModel;
		this.idledstatus;
		this.state_to_expect= 0xf ;
		this.max_retries = 3;
                this.model.bind('change:idled_status', this.updateIDLEDStatus, this);
            },

            events: {
                "click #save": "perform",
                "click .help-link": "toggleHelp"
            },

            beforeRender: function() {

            },

            afterRender: function() {
                if(sessionStorage.privilege_id < CONSTANTS["OPERATOR"]){
                    app.disableAllbutton();  
                    app.disableAllinput();  
                 }
                this.$el.find('input[name="idled_command"]').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    radioClass: 'iradio_square-blue',
                    increaseArea: '20%'
                });
                if(sessionStorage.privilege_id < CONSTANTS["OPERATOR"]){
                   $("#save").addClass("disable_a_href");
                }
                this.model.fetch();
                var _parent = this;
                _.each(this.model.attributes, function(value, attr, list) {
                    _parent.model.trigger('change:' + attr, this.model, value);
                });
            },

            load: function(model, collection, xhr) {

            },

            updateIDLEDStatus: function(model, value) {  l
	    if(value == 0) {
	    		$("#idled_status").html(locale.idled_inshared);
                $('input[name="idled_command"][value="0"]').iCheck('check');
                this.idledstatus = 0 ;
            } else if(value == 1){
            	$("#idled_status").html(locale.idled_infailover);
                $('input[name="idled_command"][value="1"]').iCheck('check');
                this.idledstatus = 1 ;
            }  else if(value == 2){
            	$("#idled_status").html(locale.idled_indedicated);
                $('input[name="idled_command"][value="3"]').iCheck('check');
                this.idledstatus = 2 ;
            }   
            },
            toggleHelp: function(e) {
                e.preventDefault();
                var help_items = this.$('.help-item').filter(function() {
                    var f = $(this).data('feature');
                    var nf = $(this).data('not-feature');
                    if (f) {
                        return (app.features.indexOf(f) == -1 ? false : true);
                    } else if (nf) {
                        return (app.features.indexOf(nf) == -1 ? true : false);
                    } else {
                        return true;
                    }
                });
                $(".tooltip").hide();
                if (help_items.hasClass('hide')) {
                    help_items.removeClass('hide');
                } else {
                    help_items.addClass('hide');
                }
            },
            perform: function(ev) {
	    	var that = this;
                if(!confirm(locale.confirm)) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    return false;
                }
		$("#save-icon").removeClass().addClass("ion-load-d");
		$("#save").addClass("disable_a_href");

		that.idledstatus = parseInt($('input[name="idled_command"]').filter(':checked').val());
                switch(that.idledstatus)
		{
			case 0:
				that.state_to_expect = 0;
				break;
			case 1:				
			case 2:				
			case 3:
				that.state_to_expect = 1;
				break;
			case 5:
				that.state_to_expect = 0;
				break;
		}
                this.model.idled(that.idledstatus, {
                    success: function(model){
                       	$(".alert-success").removeClass("hide").html("").html(locale.idled_action_wait);
                       	$(".alert-danger").addClass("hide");
						if(that.idledstatus == 2)
							inittmout = 2;
						else if(that.idledstatus == 5)
							inittmout = 3;
						else
							inittmout = 1;
						that.max_retries = 3;
						setTimeout(function(){	
							that.getStatus();
						},inittmout);
                    },
                    error: function(model){               	
                    	$(".alert-danger").removeClass("hide").html(locale.str_server_setaction);
                    	$("#save").removeClass("disable_a_href");
                        $("#save-icon").removeClass().addClass("fa fa-wrench");
                    }
                });
            },
			getStatus : function(){
				var that = this;
				this.model.fetch({
                    			global : false ,
					success : function(model, response, options) {					
						that.getIDLEDStatusRes(model);
					}
				});	
			},
			getIDLEDStatusRes : function(res){			
				current_state = res.get('idled_status');
				var that = this;
				if(this.state_to_expect != 0xf)
				{
					if(current_state != this.state_to_expect)
					{
						this.max_retries--;
						$(".alert-success").removeClass("hide").html("").html(locale.idled_retrying+this.max_retries);
						if(this.idledstatus == 5){
							timeout = 20000; 
							error_text = locale.str_server_err1;
						}
						else{
							timeout = 10000;
							error_text = locale.str_server_err2;
						}
						if(this.max_retries == 0)
						{
							$(".alert-success").addClass("hide");
							$(".alert-danger").removeClass("hide").html(error_text);				
							$("#save-icon").removeClass().addClass("fa fa-wrench");
							$("#save").removeClass("disable_a_href");
							return;
						}
											
						setTimeout(function()
						{
							that.getStatus();
						},timeout);
						
						return;
					}else{
						$(".alert-success,.alert-danger").addClass("hide");
						$("#save").removeClass("disable_a_href");
						$("#save-icon").removeClass().addClass("fa fa-wrench");
					}
				}
				if(current_state == 0)
					$("#idled_status").html(locale.inshared);
				if(current_state == 1)
					$("#idled_status").html(locale.infailover);
				if(current_state == 2)
					$("#idled_status").html(locale.indedicated);
			},
            serialize: function() {
                return {
                    locale: locale
                };
            }

        });

        return view;

    });
