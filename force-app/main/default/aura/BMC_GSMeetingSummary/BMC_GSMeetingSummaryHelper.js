({
	recordCallLogGeolocation: function(component, helper, startOrEnd){
        try{
            if(navigator.onLine){
                //If the user does not have geolocation enabled, this code will not run
                if (navigator.geolocation) {
                    if(navigator.geolocation.getCurrentPosition){
                        navigator.geolocation.getCurrentPosition(function(e) {
                            var action = component.get("c.saveAndEnd");
                            if(action){
                                action.setParams({
                                    "currLat": e.coords.latitude,
                                    "currLong": e.coords.longitude,
                                    "callLogId": component.get("v.callLogRec").Id,
                                    "startOrEnd": startOrEnd
                                });
                                action.setCallback(this, function (response) {
                                    if (response.getState() === "ERROR") {
                                        var errors = response.getError();
                                        if (errors) {
                                            if (errors[0] && errors[0].message) {
                                                console.error("Error message: " + 
                                                              errors[0].message);
                                            }
                                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                            } else {
                                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                            }
                                        } else {
                                            console.error("Unknown error");
                                        }
                                    }
                                });
                                $A.enqueueAction(action);
                            }
                        }, function(error) {
                            console.error('(GPS Error#'+error.code+') '+error.message);
                        }, {'enableHighAccuracy': false, 'timeout': 5000, 'maximumAge':0});
                    }
                }
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    
    saveSummary : function(component, event, update, helper,sumTextAreaValue) {
        try{
            if(navigator.onLine){
                var callLog = component.get("v.callLogRec");
                var pageReference = component.get("v.pageReference"); 
                        var action = component.get("c.updateMeetingSummary");
                        action.setParams({ callLog : callLog});
                        action.setCallback(this, function(response) {
                            if (response.getState() === "SUCCESS") {
                                if(update){   
                                    var sObjectEvent = $A.get("e.force:navigateToSObject");
                                       sObjectEvent.setParams({
                                           "recordId": component.get("v.recordId"),
                                           "slideDevName": "detail",
                                           "isredirect": false
                                       })
                                       sObjectEvent.fire();
                                   if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.BMC_GS_Call_Log_Summary_Success_Msg"), 'success', '5000');
                                   } else {
                                       /*var dismissActionPanel = $A.get("e.force:closeQuickAction");
                                       dismissActionPanel.fire();*/
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Success"),$A.get("$Label.c.BMC_GS_Call_Log_Summary_Success_Msg"), 'slds-theme_success');
                                    }
                                   
                                      
                                }else{
                                    console.error('Summary Text Field is not Valid');
                                }
                            } else {
                                var errors = response.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        console.error("Error message: " + 
                                                      errors[0].message);
                                    }
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                    }
                                } else {
                                    console.error("Unknown error");
                                }
                            }
                        });
                        $A.enqueueAction(action);
                   
                
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
       /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   displays toast for dekstop
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018   Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   displays toast for mobile due to neccessary workaround for known issue
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    displayToastMobileCallLog: function(component, showToast, title, message, type){
        try{
            if(showToast){
                component.set("v.showToast", true);
            }
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
            console.error(e);
        }
    },
})