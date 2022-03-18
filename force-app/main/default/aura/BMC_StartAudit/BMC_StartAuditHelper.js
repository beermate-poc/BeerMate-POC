({ 
    /**
   @Author Accenture
   @name: BMC_StartAuditController
   @Description Finds and sets recordId for an Account
   @Version <1.0>
  */
    getAccountInfo: function(helper, component, event) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getAccountRecord");
                action.setParams({ recordId:  component.get("v.recordId") });
                action.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        component.set("v.accountRec", data.getReturnValue());
                    }
                    else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            } else {
                                this.displayToastMob(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            // console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
        }
        catch(e){
            this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    getDistributor: function(helper, component, event) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getAllDistributor");
                action.setParams({ recordId:  component.get("v.recordId") });
                action.setCallback(this, function (response) {
                    if (response.getState() === "SUCCESS") {
                        if (response.getReturnValue().length > 0) {
                            var results = response.getReturnValue().map(function(property) {
                                return JSON.parse(property);
                            });
                            component.set('v.distributorList', results);
                            if (response.getReturnValue().length === 1) {
                                component.set('v.distributorDefault',results[0].id);
                            }
                        }
                    }
                    else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                // console.error("Error message: " + errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            } else {
                                this.displayToastMob(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            // console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
        }
        catch(e){
            this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    findRetailaduitrecord: function(helper, component, event) {
        // Finds retail audit records
        try{
            
            if(navigator.onLine){
                var action = component.get("c.findRetailAudit");
                action.setParams({ accountId:  component.get("v.recordId"),
                                  distributorId:component.find("distributorId").get("v.value"),
                                  auditDate:component.get("v.today")
                                 });
                
                action.setCallback(this, function (data) {
                    
                    if (data.getState() === "SUCCESS") {
                        
                        if (data.getReturnValue().length < 1) {
                            
                            helper.saveRetailaduitrecord(helper, component, event);
                        }
                        else{
                            var retailObj = data.getReturnValue();
                            var navEvt = $A.get("e.force:navigateToSObject");
                            navEvt.setParams({
                                "recordId": retailObj[0].Id,
                                "slideDevName": "detail"
                            });
                            navEvt.fire();
                        }
                    }
                    else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                // console.error("Error message: " + errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            } else {
                                this.displayToastMob(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            // console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
        }
        catch(e){
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    }, 
    saveRetailaduitrecord: function(helper, component, event) {
        try{
            if(navigator.onLine){
                var action = component.get("c.saveRetailAudit");
                action.setParams({ accountId:  component.get("v.recordId"),
                                  distributorId:component.find("distributorId").get("v.value"),
                                  auditDate:component.get("v.today")
                                 });
                action.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        var retailObj = data.getReturnValue();
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": retailObj.Id,
                            "slideDevName": "detail"
                        });
                        navEvt.fire();
                    }
                    else {
                        // success save
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                // console.error("Error message: " + errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            } else {
                                this.displayToastMob(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            // console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
        }
        catch(e){
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                // fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toast.setParams(toastParams);
                toast.fire();
            } 
        } catch(e){
            component.set("v.showErrorToast", false);
        }
    },
    displayToastMob: function(component, title, message, type){
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
          component.set("v.showErrorToast", false);
        }
    }    
})