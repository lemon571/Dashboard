define(['jquery', 'underscore', 'backbone', 'app',"cc",
        //data
        'collection/users',
        'text!templates/login.html',
        'supported_languages',
        //localize
        'i18n!:common',
        'i18n!:error',
        //plugins
        "select2",
        'tooltip',

        // 'moment',
        // 'knob',
        // 'sparkline'
    ],

    function($, _, Backbone, app,CC, UsersCollection, LoginTemplate,supportedlanguages, CommonStrings, errorStrings) {
        //BIT manipulation for privilege
        var KVM_ENABLED = 0, VMEDIA_ENABLED = 1; //Extended privilege

        var view = Backbone.View.extend({

            template: template(LoginTemplate),

            initialize: function() {
                this.GENERATE_OTP = 1;
                this.VERIFY_OTP = 2;
                this.RESET_PWD = 3;
                this.snmpEnable = "";

                this.passwordStatus = 0;

                this.bindLanguage();
            },

            events: {
                        "click #btn-login": "login",
                        "click #remember_me": "updateremember_me",
                        //"click #btn-login": "login",
                        "click #forgot-password": "forgotPassword",
                        "click #otp_submit": "SubmitOTP",
                        "click #idnewpswd_submit" : "SubmitNewPassword",
                        "change #select_lang": "setLanguage",
                    },

            beforeRender: function() {
                this.$el.addClass("form-box").attr("id", "login-box");
                this.$el.removeClass("animated fadeOutDown").addClass("animated fadeInDown");
                $("html,body").addClass("bg-black");
                $("#ami_logo").removeClass("hide");
            },

            afterRender: function() {
                $(".header").html(app.brand_title);
                                 
                this.bindLanguage();
                $('#select_lang').select2();

                document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		var that = this;
		_.defer(function(){
		  that.$('#userid').focus();
		});

                this.remember_me_username();
                that.UpdateOemImage('/res/oem/h5banner_right.png','h5banner_right');
                that.UpdateOemImage('/res/oem/h5banner_left.png','h5banner_left');

                for (var languages in supportedlanguages.languages) {
                    if (!supportedlanguages.languages[languages]) {
                        $("#" + languages).remove();
                    }
                }
            },
            UpdateOemImage: function(url,banner) {
                  var img = new Image();
                  img.src = url;
                  img.onload = function() { 
                        $("#id"+banner).attr("src", "/res/oem/"+banner+".png");
                    };
                  img.onerror = function() { return;};             
            },
            setLanguage: function(){
                localStorage.select_lang = $('#select_lang').val();
                document.cookie = "lang="+localStorage.select_lang;
                $("#processing_layout").removeClass("hide-spinner");
                $("#processing_image").removeClass("hide-spinner");
                location.reload();
            },
            bindLanguage: function(){
                if (localStorage.select_lang != undefined) {
                    $('#select_lang').val(localStorage.select_lang);
                }else{
                    if(app.selected_language){
                        $('#select_lang').val(window.navigator.language);  
                    }else{
                        $('#select_lang').val("en-US");  
                    }
                }
            },
            updateremember_me: function() {

                if ($('#remember_me').is(':checked')) {
                    localStorage.remember_usrname = $('#userid').val();
                    localStorage.remember_chkbx = true;
                } else {
                    localStorage.remember_usrname = '';
                    localStorage.remember_chkbx = false;
                }

            },
	    remember_me_username: function() {
                if (localStorage.remember_chkbx != undefined) {
                     if (localStorage.remember_chkbx == "true") {
                        $('#remember_me').attr('checked', 'checked');
                         $('#userid').val(localStorage.remember_usrname);
                     } else { 
                         $('#remember_me').removeAttr('checked');
                         $('#userid').val('');
                     }                  
                 }
            },
			
            login: function() {
                $('#btn-login').attr("disabled","disabled");    
                var context = this;

                if($("#userid").val() == "" || $("#password").val() == "") {
                    var err_msg =  ($("#userid").val() == "") ? CommonStrings.t("common:missing_username") : CommonStrings.t("common:missing_password");
                    var div_id = ($("#userid").val() == "") ? "#userid" :"#password";
                    context.$(div_id).tooltip('destroy');
                    context.$(div_id).tooltip({
                        animation: false,
                        title: err_msg,
                        trigger: 'manual',
                        placement: 'top'
                    });
                    context.$("#userid,#password").tooltip('hide');
                    context.$(div_id).tooltip('show');
                    context.$el.find("#userid,#password")
                    .removeClass("animated shake")
                    .addClass("animated shake");
                    $('#btn-login').removeAttr("disabled");
                    return;
                }
                        
		        this.updateremember_me();
                $("#processing_layout").removeClass("hide-spinner");
                $("#processing_image").removeClass("hide-spinner");
                
                if(localStorage.getItem("garc") != null )
                {
                    $("#processing_layout").addClass("hide-spinner");
                    $("#processing_image").addClass("hide-spinner");
                    $('#btn-login').removeAttr("disabled");
                    $("#ami_logo").addClass("hide");
                    app.initialize();
                        app.SessionStorage();
                        $("html,body").removeClass("bg-black");
                        app.router.navigate("dashboard", {
                        trigger: true
                    });
                }
                else {
                var userid_val = $("#userid").val();          
                $.ajax({
                    type: "POST",
                    url: "/api/session",
                    dataType: "json",
                    data: {
                        username: $("#userid").val(),
                        password: $("#password").val()
                    },
                    success: function(data) {
                        document.cookie = "refresh_disable=1";
                        var userPrivilege = ['User', 'OEM', 'Operator', 'Administrator'];
                        if(data.ok != 0 && data.passwordStatus == 1){
                            context.$('#userid').tooltip('destroy');
                            context.$('#userid').tooltip('hide');
                            $.ajaxSetup({
                                headers: {'X-CSRFTOKEN': data.CSRFToken}
                            });
                            context.passwordStatus = data.passwordStatus;
                            window.sessionStorage.setItem("garc", data.CSRFToken);
                            $("#login_form").addClass("hide");
                            $("#change_password_form").removeClass("hide");
                            $("#change_password_info").html(CommonStrings.t("common:change_password_info_content"));
			    $("#newpswd").focus();
                        }
                    	else if (data.ok === 0) {
                            context.$('#userid').tooltip('destroy');
                            context.$('#userid').tooltip('hide');
                            $("#ami_logo").addClass("hide");
                            context.$el.removeClass("animated fadeInDown").addClass("animated fadeOutDown");
                            $("html,body").removeClass("bg-black");
                            $.ajaxSetup({
                                headers: {'X-CSRFTOKEN': data.CSRFToken}
                            });

                            //window.sessionStorage.setItem('privilege', data.privilege);
                            //garc - csrftoken.. just a name change here
                            //storing to keep the session active across reload
                            //a csrf attack form cannot access sessionstorage of the primary domain
                            window.sessionStorage.setItem("garc", data.CSRFToken);
                            window.sessionStorage.setItem("privilege_id", data.privilege);
                            window.sessionStorage.setItem("extended_privilege", data.extendedpriv);
                            window.sessionStorage.setItem("session_id", data.racsession_id);
                            window.localStorage.setItem("garc", data.CSRFToken);
                            window.sessionStorage.setItem('username', userid_val);
                            window.localStorage.setItem("privilege_id", data.privilege);
                            window.localStorage.setItem("extended_privilege", data.extendedpriv);
                            window.localStorage.setItem("session_id", data.racsession_id);

                            var ex_priv = parseInt(window.sessionStorage.extended_privilege);

                            //if the 0th bit in kvm privilege is 1, then KVM is enabled
                            var isKVMEnabled = (ex_priv & (1 << 0)) != 0;
                            //if the 1st bit in kvm privilege is 1, then VMedia is enabled
                            var isVMediaEnabled = (ex_priv & (1 << 1)) != 0;

                                if (data.privilege > CONSTANTS["USER"]) {
                                    if(data.user_id < 1000)
                                    {
                                        $.ajax({
                                            url : "/api/settings/dashboarduser",
                                            type : "GET",
                                            dataType : "json",
                                            data : {
                                                "user_id" : data.user_id,
                                                "channel_id" : data.channel,
                                                "user_name" : userid_val
                                            },
                                            contentType : "application/json",
                                            success : function(user_data, status, xhr) {
                                                $("#processing_layout").addClass("hide-spinner");
                                                $("#processing_image").addClass("hide-spinner");
                                                $('#btn-login').removeAttr("disabled");

                                                /* Enabling KVM / VMedia access */
                                                window.sessionStorage.setItem('kvm_access',1); /* 1 = ENABLE */
                                                window.sessionStorage.setItem('vmedia_access', 1);
                                                window.localStorage.setItem('kvm_access', 1);
                                                window.localStorage.setItem('vmedia_access', 1);

                                                if (typeof user_data.id !=
                                                        "undefined") {
                                                    window.sessionStorage.setItem('privilege', user_data.privilege.charAt(0).toUpperCase() + user_data.privilege.slice(1));
                                                    window.sessionStorage.setItem('id', user_data.id);
                                                    window.sessionStorage.setItem('since', user_data.creation_time);
                                                    window.localStorage.setItem('privilege', user_data.privilege.charAt(0).toUpperCase() + user_data.privilege.slice(1));
                                                    window.localStorage.setItem('id', user_data.id);
                                                    window.localStorage.setItem('since', user_data.creation_time);
                                                } else {
                                                    window.sessionStorage.setItem('privilege', userPrivilege[data.privilege - 1]);
                                                    window.sessionStorage.setItem('id', 0);
                                                    window.sessionStorage.setItem('since', Math.floor(Date.now() / 1000));
                                                    window.localStorage.setItem('privilege', userPrivilege[data.privilege - 1]);
                                                    window.localStorage.setItem('id', 0);
                                                    window.localStorage.setItem('since',Math.floor(Date.now() / 1000));
                                                }

                                                /* If the user has no KVM privilege,
                                                 * then disable kvm access */
                                                if (!isKVMEnabled) {
                                                    window.sessionStorage.setItem('kvm_access', 0); /* 0 = DISABLE */
                                                    window.localStorage.setItem('kvm_access', 0);
                                                }

                                                /* If the user has no VMedia
                                                 * privilege, then disable vmedia
                                                 * access */
                                                if (!isVMediaEnabled) {
                                                    window.sessionStorage.setItem(
                                                            'vmedia_access', 0);
                                                    window.localStorage.setItem(
                                                            'vmedia_access', 0);
                                                }

                                                app.initialize();
                                                app.showLoader();
                                                app.router.navigate(
                                                        "dashboard",
                                                        {trigger : true});
                                            },
                                            error : function(xhr, status, err) {
                                                $("#processing_layout").addClass("hide-spinner");
                                                $("#processing_image").addClass("hide-spinner");
                                                $('#btn-login').removeAttr("disabled");

                                                window.sessionStorage.setItem('privilege', userPrivilege[data.privilege - 1]);
                                                window.sessionStorage.setItem('id', 0);
                                                window.sessionStorage.setItem('since', Math.floor(Date.now() / 1000));
                                                window.localStorage.setItem('privilege', userPrivilege[data.privilege - 1]);
                                                window.localStorage.setItem('id', 0);
                                                window.localStorage.setItem('since', Math.floor(Date.now() / 1000));

                                                app.initialize();
                                                app.showLoader();
                                                app.router.navigate(
                                                        "dashboard",
                                                        {trigger : true});
                                            }
                                        });
                                    }
                                    else
                                    {
                                        $("#processing_layout").addClass("hide-spinner");
                                        $("#processing_image").addClass("hide-spinner");
                                        $('#btn-login').removeAttr("disabled");

                                        /* Enabling KVM / VMedia access */
                                        window.sessionStorage.setItem('kvm_access',1); /* 1 = ENABLE */
                                        window.sessionStorage.setItem('vmedia_access', 1);
                                        window.localStorage.setItem('kvm_access', 1);
                                        window.localStorage.setItem('vmedia_access', 1);

                                        window.sessionStorage.setItem('privilege', userPrivilege[data.privilege - 1]);
                                        window.sessionStorage.setItem('id', 0);
                                        window.sessionStorage.setItem('since', Math.floor(Date.now() / 1000));
                                        window.localStorage.setItem('privilege', userPrivilege[data.privilege - 1]);
                                        window.localStorage.setItem('id', 0);
                                        window.localStorage.setItem('since',Math.floor(Date.now() / 1000));

                                        /* If the user has no KVM privilege,
                                         * then disable kvm access */
                                        if (!isKVMEnabled) {
                                            window.sessionStorage.setItem('kvm_access', 0); /* 0 = DISABLE */
                                            window.localStorage.setItem('kvm_access', 0);
                                        }

                                        /* If the user has no VMedia
                                         * privilege, then disable vmedia
                                         * access */
                                        if (!isVMediaEnabled) {
                                            window.sessionStorage.setItem(
                                                    'vmedia_access', 0);
                                            window.localStorage.setItem(
                                                    'vmedia_access', 0);
                                        }

                                        app.initialize();
                                        app.showLoader();
                                        app.router.navigate(
                                                "dashboard",
                                                {trigger : true});
                                    }
                                } else {
                                $("#processing_layout").addClass("hide-spinner");
                                $("#processing_image").addClass("hide-spinner");
                                $('#btn-login').removeAttr("disabled");
                                window.sessionStorage.setItem('privilege', 'User');
                                //window.sessionStorage.setItem('id', data.userid);
                                window.sessionStorage.setItem('id', 0);
                                window.sessionStorage.setItem('since', Math.floor(Date.now() / 1000));
                                window.sessionStorage.setItem('kvm_access', 0);
                                window.sessionStorage.setItem('vmedia_access', 0);
                                window.localStorage.setItem('privilege', 'User');
                                //window.sessionStorage.setItem('id', data.userid);
                                window.localStorage.setItem('id', 0);
                                window.localStorage.setItem('since', Math.floor(Date.now() / 1000));
                                window.localStorage.setItem('kvm_access', 0);
                                window.localStorage.setItem('vmedia_access', 0);

                                /* If the user has KVM privilege, then enable kvm access */
                                if(isKVMEnabled){
                                    window.sessionStorage.setItem('kvm_access', 1);
                                    window.localStorage.setItem('kvm_access', 1);
                                }

                                /* If the user has VMedia privilege, then enable vmedia access */
                                if(isVMediaEnabled){
                                    window.sessionStorage.setItem('vmedia_access', 1);
                                    window.localStorage.setItem('vmedia_access', 1);
                                }

                                    app.initialize();
                                    app.showLoader();
                                    app.router.navigate("dashboard", {
                                        trigger: true
                                    });
                            }
                        } else {
                            $("#processing_layout").addClass("hide-spinner");
                            $("#processing_image").addClass("hide-spinner");
                            $('#btn-login').removeAttr("disabled");
                           	context.$('#userid').tooltip('destroy');
                        	context.$('#userid').tooltip({
                                animation: false,
                                title: CommonStrings.t("common:_nvalid_username_or_password"),
                                trigger: 'manual',
                                placement: 'top'
                            });
                            context.$("#userid,#password").tooltip('hide');
                            context.$('#userid').tooltip('show');
                            context.$el.find("#userid,#password")
                                .removeClass("animated shake")
                                .addClass("animated shake");
                        }

                    },
                    error: function(xhr, textStatus, errorThrown) {
                        var errorResponse = xhr;
                        var errorJsonResponse = errorResponse.responseJSON;
                        $("#processing_layout").addClass("hide-spinner");
                        $("#processing_image").addClass("hide-spinner");
                        $('#btn-login').removeAttr("disabled");
                        if(errorJsonResponse.code == CC.MAX_NUM_SESSIONS_ALREADY_IN_USE){
                            err_msg = CommonStrings.t("common:maximum_sessions_in_use");
                        }else if(errorJsonResponse.code == CC.LOGINERR_PAM_PERM_DENIED){        //Locking out user after 5 wrong login attempts
                            err_msg = CommonStrings.t("common:tried_login_manytimes");      //These changes are specific to Power8 & Power9 Platforms.
                        }else if(errorJsonResponse.code == CC.FIRMWARE_UPDATE_IS_IN_PROGRESS){
                            err_msg = CommonStrings.t("common:firwmare_update_is_in_progress_login_blocked");
                        }
                        else{
                            err_msg = CommonStrings.t("common:_nvalid_username_or_password");
                        }
                        context.$('#userid').tooltip('destroy');
                        context.$('#userid').tooltip({
                            animation: false,
                            title: err_msg,
                            trigger: 'manual',
                            placement: 'top'
                        });
                        context.$("#userid,#password").tooltip('hide');
                        context.$('#userid').tooltip('show');
                        context.$el.find("#userid,#password")
                            .removeClass("animated shake")
                            .addClass("animated shake");
                        
                    }
                });
            }
            },

            forgotPassword: function() {
                var context = this;
                if($("#userid").val() == "") {
                    var err_msg = CommonStrings.t("common:missing_username");
                    context.$("#userid").tooltip('destroy');
                    context.$("#userid").tooltip({
                        animation: false,
                        title: err_msg,
                        trigger: 'manual',
                        placement: 'top'
                    });
                    context.$("#userid").tooltip('show');
                    context.$el.find("#userid")
                    .removeClass("animated shake")
                    .addClass("animated shake");
                    return;
                }
                    
                if (confirm(CommonStrings.t("common:pw_reset_confirm"))) {
                    $.ajax({
                        type: "POST",
                        url: "/api/reset-pass",
                        dataType: "json",
                        data: {
                            username: $("#userid").val(),
                            param: context.GENERATE_OTP
                        },
                        complete: function(data) {
                            var returncode = data.responseJSON.code & 0xff;
                            
                            switch (returncode)
                            {
                                case 0x0:
                                    alert(CommonStrings.t("common:pw_otp_success"));
                                    $("#login_form").addClass("hide");
                                    $("#otp_form").removeClass("hide");
                                    $("#idotp").focus();
                                    break;
                                case 0x11:
                                    alert(CommonStrings.t("common:pw_reset_smtp_disabled"));
                                    break;
                                case 0x12:
                                case 0x13:
                                case 0x14:
									var temp = "common:pw_reset_smtp_fail_"+ (returncode - 0x11);
                                    alert(CommonStrings.t(temp));
                                    break;
                                case 0x3:
                                    alert(CommonStrings.t("common:pw_reset_email_fail_1"));
                                    break;
                                case 0x10:
                                    alert(CommonStrings.t("common:pw_reset_email_fail_2"));
                                    break;
                                case 0x15:
                                    alert(CommonStrings.t("common:pw_reset_fail_email"));
                                    break;
                                default:
                                    alert(CommonStrings.t("common:pw_reset_fail"));
                            }
                        }
                    });
                }
            },
            SubmitOTP: function(){
                var context = this;
                var otp_val = $("#idotp").val();
                var err_msg = "";
                if(otp_val == ""){
                    err_msg = CommonStrings.t("common:missing_otp");
                }else if(otp_val.length>0 && (otp_val.length < 8 || !(/^[0-9]*$/.test(otp_val)))){
                    err_msg = CommonStrings.t("common:invalid_otp");
                }
                if(err_msg != "") {                   
                    context.$("#idotp").tooltip('destroy');
                    context.$("#idotp").tooltip({
                        animation: false,
                        title: err_msg,
                        trigger: 'manual',
                        placement: 'top'
                    });
                    context.$("#idotp").tooltip('show');
                    context.$el.find("#idotp")
                    .removeClass("animated shake")
                    .addClass("animated shake");
                    return;
                }    
                $.ajax({
                    type: "POST",
                    url: "/api/reset-pass",
                    dataType: "json",
                    data: {
                        username: $("#userid").val(),
                        verifyOTP : $("#idotp").val(),
                        param: context.VERIFY_OTP
                    },
                    complete: function(data) {
                        var returncode = data.responseJSON.code & 0xff;
                        context.snmpEnable = data.responseJSON.snmp_enable;
                        switch (returncode)
                        {
                            case 0x0:
                                $("#otp_form").addClass("hide");
                                $("#login_form").addClass("hide");
                                $("#change_password_form").removeClass("hide");
                                break;
                            default:
                                alert(CommonStrings.t("common:pw_otp_fail"));
                        }
                    }
                });
            },
            SubmitNewPassword : function(){
                var context = this;
                snmpEnable = context.snmpEnable;
                var newpswd = $("#newpswd").val();
                var confirmpswd =  $("#confirmpswd").val();
                var err_msg = div_id = "";
              
                if(newpswd == "" || confirmpswd == "") {
                    err_msg =  (newpswd == "") ? CommonStrings.t("common:missing_password") : CommonStrings.t("common:missing_confirmpassword");
                    div_id = (newpswd == "") ? "#newpswd" :"#confirmpswd";
                }
               
                if(newpswd != "" && confirmpswd != "" && newpswd != confirmpswd) {
                    err_msg = CommonStrings.t("common:mismatch_password");
                    div_id = "#confirmpswd";                  
                }

                if(newpswd != "" && (!(/^[\S]{8,}$/.test(newpswd))  || (newpswd.length>20)))
                {
                    err_msg = CommonStrings.t("common:invalid_password");
                    div_id = "#newpswd";
                }

                if(err_msg !=""){
                    context.$(div_id).tooltip('destroy');
                    context.$(div_id).tooltip({
                        animation: false,
                        title: err_msg,
                        trigger: 'manual',
                        placement: 'top'
                    });
                    context.$("#newpswd,#confirmpswd").tooltip('hide');
                    context.$(div_id).tooltip('show');
                    context.$el.find("#newpswd,#confirmpswd")
                    .removeClass("animated shake")
                    .addClass("animated shake");
                    return false;
                }
                if(context.passwordStatus == 1)
                {
                    $.ajax({
                        type: "POST",
                        url: "/api/updatenew_password",
                        dataType: "json",
                        data: {
                            password: $("#newpswd").val(),
                            username: $("#userid").val()
                        },
                        success: function(data) {
                            var returncode = data.code & 0xff;
                            switch (returncode)
                            {
                                case 0x0:
                                    alert(CommonStrings.t("common:pw_reset_success"));
                                    $("#otp_form").addClass("hide");
                                    $("#change_password_form").addClass("hide");
                                    $("#login_form").removeClass("hide");
                                    app.logout();
                                    document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    app.router.navigate("login");
                                    location.reload();
                                    break;
                                default:
                                    alert(CommonStrings.t("common:pw_reset_fail"));
                                    return false;
                            }
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            var errorResponse = xhr;
                            var errorJsonResponse = errorResponse.responseJSON;
                            console.log(errorJsonResponse);
                            var temp = "common:pw_reset_fail";
                            if(errorJsonResponse.code == 19000){
                                var temp = "error:"+"error_code_"+errorJsonResponse.code;
                            }
                            var error_alert = errorStrings.t(temp);
                            alert(error_alert);
                            return false;
                        }
                    });
                    
                }
                else{
                    $.ajax({
                        type: "POST",
                        url: "/api/reset-pass",
                        dataType: "json",
                        data: {
                            Password: $("#newpswd").val(),
                            RetypePassword : $("#confirmpswd").val(),
                            param: context.RESET_PWD,
                            username: $("#userid").val()
                        },
                        success: function(data) {
                            var returncode = data.code & 0xff;
                            switch (returncode)
                            {
                                case 0x0:
                                    alert(CommonStrings.t("common:pw_reset_success"));
                                    $("#otp_form").addClass("hide");
                                    $("#change_password_form").addClass("hide");
                                    $("#login_form").removeClass("hide");
                                    /*app.logout();
                                    document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    app.router.navigate("login");
                                    location.reload();*/
                                    break;
                                default:
                                    alert(CommonStrings.t("common:pw_reset_fail"));
                                    return false;
                            }
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            var errorResponse = xhr;
                            var errorJsonResponse = errorResponse.responseJSON;
                            console.log(errorJsonResponse);
                            var temp = "common:pw_reset_fail";
                            if(errorJsonResponse.code == 19000){
                                var temp = "error:"+"error_code_"+errorJsonResponse.code;
                            }
                            var error_alert = errorStrings.t(temp);
                            alert(error_alert);
                            return false;
                        }
                    });
                }
            },
            serialize: function() {
                return {
                    locale: CommonStrings
                };
            }

        });

        return view;

    });
