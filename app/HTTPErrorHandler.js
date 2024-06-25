define(["cc", "app",
    //data
    
    "collection/notifications",
    "collection/messages",
    "models/notification",
    "models/message",
    //localize
    "i18n!:error",
    "i18n!:common"
], function(CC, app,
    NotificationCollection, MessageCollection,
    NotificationModel, MessageModel, errorStrings, CommonStrings) {


var IpCallExist = false;

    var error_handler = function(xhr, textStatus, errorThrown) {
        var NL = "\n";
        var msg = "";
        var code = 0;
        var errorLog = 0;
        var remember_chkbx = localStorage.getItem('remember_chkbx');
        var remember_usrname = localStorage.getItem('remember_usrname');
        var newEventCount = sessionStorage.getItem('newEventCount');
        if( textStatus == "timeout" || xhr.status == 0  ){
          
            if(localStorage.getItem('isActiveKVM') == "true"){
                if( sessionStorage.features.indexOf("KVM_SESSION_RECONNECT") > -1   ) {
                    return false;
                }

            }
            
            if(IpCallExist == false){

                var Ip = location.host;
                $.ajax({
                    url:Ip,
                    type: "POST",
                    timeout:6000, 
                    global:false,
                     success: function() {
                    },
                    error: function(event, request, settings){

                        if (event.status == 0 || request == "timeout"){ 
                         
                            if (window.kvmWindow != undefined){
                                window.kvmWindow.close();
                                delete window.kvmWindow;
                                localStorage.removeItem('isActiveKVM'); 
                            }
                            localStorage.clear();
                            localStorage.setItem('remember_chkbx',remember_chkbx);
                            localStorage.setItem('remember_usrname',remember_usrname);
                            sessionStorage.clear();
                            sessionStorage.setItem('newEventCount',newEventCount);
                            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            location.href = "#login";
                             
                        } 
                    }
                });
                IpCallExist = true;
            }   
 
        
        }
            
        switch (xhr.status) {
            case CC.HTTP.UNAUTHORIZED:
                //avoding session expiry if existing session is opened in same browser or in tab and user start doing firmware update.
                var flash_state = window.localStorage.getItem("fw_flash_state");
                if(window.fw_upgrade != undefined){
                    if (flash_state == 1 && window.fw_upgrade == true) return; 
                }
                else if (flash_state == 1 && window.fw_upgrade == undefined) {
                    if(!$("body").hasClass("disable_a_href")){
                        $("body").addClass("disable_a_href");
                        var div_outer = document.createElement('div');
                        var div_inner = document.createElement('div');
                        var heading = document.createElement('h3');
                        div_outer.className="processing_img_outer";
                        div_outer.setAttribute("style", "left:25%");
                        
                        div_inner.className="alert alert-info";
                        div_inner.setAttribute("style", "width: 100%;height: 70px;vertical-align: middle;");

                        heading.setAttribute("style", "float: left;margin: auto;font-size: 30px;");
                        heading.innerHTML = "Firmware update in progress hence navigation has been blocked.";

                        div_inner.appendChild(heading);
                        div_outer.appendChild(div_inner);
                        $("body").append(div_outer);
                    }
                    return;
                } 
                else{

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
                    if(myCookie == 1){
                        if (window.kvmWindow != undefined){
                            window.kvmWindow.close();
                            delete window.kvmWindow;
                            localStorage.removeItem('isActiveKVM'); 
                        }
                        localStorage.clear();
                        localStorage.setItem('remember_chkbx',remember_chkbx);
                        localStorage.setItem('remember_usrname',remember_usrname);
                        sessionStorage.clear();
                        sessionStorage.setItem('newEventCount',newEventCount);
                        document.cookie = "refresh_disable=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    alert(CommonStrings.t("common:session_expired"));
                        location.href = "#login";
                        
                    }else{
                        var currentUrl = location.hash;
                        if(currentUrl.indexOf("login") == -1){
                            localStorage.clear();
                            localStorage.setItem('remember_chkbx',remember_chkbx);
                            localStorage.setItem('remember_usrname',remember_usrname);
                            sessionStorage.clear();
                            sessionStorage.setItem('newEventCount',newEventCount);
                            document.cookie = "QSESSIONID=1;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            alert(CommonStrings.t("common:session_expired"));
                            location.href = "#login";
                            
                        }
                    }
                }
                break;
            case CC.HTTP.NO_PRIVILEGE_ACCESS:
                //app.hidePage();
                errorLog = 1;
                msg = "";
                alert(errorStrings.t("error:non_privilege_user_error_message"));
                break;
            case CC.HTTP.NOT_FOUND:
                msg = errorStrings.t("error:Requested_resource_ not_found"); 
                break;
            case CC.HTTP.FEATURE_NOT_ENABLED:
                errorLog = 2;
                msg = errorStrings.t("error:feature_not_enabled_error_message");
                alert(msg);
                break;
            case CC.HTTP.LICENSE_NOT_AVAILABLE:
                errorLog = 2;
                msg = errorStrings.t("error:license_not_avaiable_error_message");
                alert(msg);
                break;
            case CC.HTTP.SERVER_ERROR:
            	msg = errorStrings.t("error:server_error_encountered"); 
                break;
            case CC.HTTP.LARGE_FILE_SIZE:
                msg=" Large file size. Use Java player application. "+NL;
                break;
            case CC.RECORDING_IN_PROGRESS:
                msg = errorStrings.t("error:error_code_1442");
                break;
            case CC.CUSTOM_STATUS_MSG: // No need to add a new line. Simply just show the received msg
            default:
                break;
        }

        if(xhr.responseJSON) {
            code = xhr.responseJSON.code                
        } else {
            code = xhr.status;
        }

        if(errorLog != 0){
            var redirectURL = location.hash;
            if(redirectURL.indexOf("maintenance") > -1){
                location.href = "#maintenance";
            }
            else if(redirectURL.indexOf("settings") > -1){
				window.history.back();
            }else{
                location.href = "#dashboard"; 
            }
        }else{
            var temp = "error:"+"error_code_"+code;
            var error_alert = errorStrings.t(temp);
            if(!error_alert.match(temp) &&  xhr.status == CC.CUSTOM_STATUS_MSG && $('.alert-success').length>0){
                if($('.alert-danger').length>0){$('.alert-danger').addClass("hide");}
                $('.alert-success').removeClass("hide");
                $('.alert-success').html(error_alert);
            }else if(!error_alert.match(temp) && $('.alert-danger').length>0){
                $('.alert-danger').removeClass("hide");
                $('.alert-danger').html(error_alert);
            }
        }


        // Notification should be avoided for custom messages
        if (xhr.responseJSON && xhr.status != CC.CUSTOM_STATUS_MSG) {
            switch (xhr.responseJSON.code) {
                case CC.KVM_TOKEN_GEN_FAILED:
                    if(errorLog != 2){
                        msg +=  xhr.responseJSON.error;
                    }  
                    msg += NL + " [code: " + xhr.responseJSON.code + "]";
                    break;
                default:
                    if(errorLog != 2){
                        msg += xhr.responseJSON.error;
                    } 
                    msg += NL + " [code: " + xhr.responseJSON.code + "]";
                    break;
            }
        } 
        if(msg){
            NotificationCollection.add(new NotificationModel({
                id: code+(new Date()).getTime(),
                message_group: "failure",
                message: msg,
                severity: "danger"
            }));
        }
        
        //alert(msg);

    };

    return error_handler;
})
