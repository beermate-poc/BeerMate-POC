({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   runs validity check for input fields
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    inputValidityCheck: function (component, value) {
        try{
            if (typeof value != 'undefined' && !value.get('v.validity').valid) {
                var missingValue = value.get('v.messageWhenValueMissing');
                var message = missingValue && value.get('v.validity').valueMissing ? missingValue : $A.get("$Label.c.Complete_Required_Fields");
                if($A.get("$Browser.formFactor") == "DESKTOP"){
                    this.displayToast('warning', message, 'warning');
                } else {
                    this.displayToastMobile(component, 'warning', message, 'slds-theme_warning');
                }
                return false;
            }
            return true;
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   validates input fields on the page
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    validatePage: function (component, event) {
        try{
            var errorsFound = false;
            var note = component.get("v.newNote");
            if (note) {
                this.inputValidityCheck(component, component.find("noteTitle")) ? null : errorsFound = true;
                this.inputValidityCheck(component, component.find("noteBody")) ? null : errorsFound = true;
                }
            if (!errorsFound) {
                this.addNote(component, event);
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   displays toast on desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
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
                if (duration) {
                    toastParams['Duration'] = duration
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
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   displays toast on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    displayToastMobile: function(component, title, message, type){
        try{
            component.set("v.showErrorToast", true);
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showErrorToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   navigates to call log after note is created
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    navigateToCallLog : function(component, event){
        if($A.get("$Browser.formFactor") == "DESKTOP"){
            component.set("v.showNewNote", false);
            component.set("v.loadNotes", true);
        } else {
            component.set("v.showNewNoteAIF", false);
            component.set("v.showObjView", true);
            component.set("v.newRecord", component.find("noteTitle").get("v.value"));
            component.set("v.showToast", true);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   creates new note
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    addNote : function(component, event) {
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                var action = component.get("c.createNote");
                var accountId = component.get("v.accountId");
                var body = component.find("noteBody").get("v.value");
                if(!body){
                    body = 'No description';
                }
                action.setParams({
                    "title" : component.find("noteTitle").get("v.value"),
                    "body" : body,
                    "accountId": accountId
                });
                action.setCallback(this, function(a) {
                    if (a.getState() === "SUCCESS") {
                        $A.util.addClass(spinner, "slds-hide");
                        var name = component.find("noteTitle").get("v.value");  
                        if($A.get("$Browser.formFactor") == "DESKTOP"){
                            this.displayToast($A.get("$Label.c.Success"), name + ' ' + $A.get("$Label.c.Record_Created"), 'success');
                        }
                        this.navigateToCallLog(component, event);
                    } else if (a.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = a.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
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
                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    }
})