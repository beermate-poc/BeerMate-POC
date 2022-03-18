({
    /**
   @Author Accenture
   @name navigateBack
   @CreateDate  9/13/2018
   @Description Function opens new audit item page.
  */
    initCall : function(component, event, helper, saveNew) {
        setTimeout(function(){ component.find("location").focus(); }, 10);
        component.find("auditRec").getNewRecord(
            "BMC_Audit_Item__c", // objectApiName
            null, // recordTypeId
            false, // skip cache?
            $A.getCallback(function() {
                var rec = component.get("v.newauditItem");
                var error = component.get("v.newContactError");
                if(error || (rec === null)) {
                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                }
                else {
                    if(saveNew){
                        if(component.get("v.saveAndScan")===true){
                            component.set("v.searchKeyWord", '');
                            component.set("v.saveAndScan", false);
                        }
                        component.set("v.codeDate", '');
                        component.set("v.repackValue", '');
                        component.set("v.damageValue", '');
                        if(component.get("v.manufactureDate")===true){
                            component.set("v.manufactureDate", false);
                        }                       
                        if(component.get("v.outofRotation")===true){
                            component.set("v.outofRotation", false);
                        }
                        component.set("v.auditRecord.BMC_UI_Quantity__c", '');
                        component.set("v.codeRequired", true);
                    }
                }
            })
        );
        this.showallAuditItems(component, event, helper);
    },
    /**
   @Author Accenture
   @name fetchauditItem
   @CreateDate  9/13/2018
   @Description Function retrieves the location and UOM from the previous Audit Item.
  */
    fetchauditItem : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var previousAudit = component.get("c.getpreviousAudit");
                previousAudit.setParams({recordId: component.get("v.recordId")});
                previousAudit.setCallback(this, function(a) {
                    var stateVal = a.getState();
                    if (stateVal === "SUCCESS") {
                        if(a.getReturnValue().length > 0){
                            component.set("v.previousLocation", a.getReturnValue()[0].BMC_Location__c);
                            if(component.get("v.fromButton")){
                                component.set("v.initUom", a.getReturnValue()[0].BMC_UOM__c);  
                                component.set("v.fromButton", false);
                            }                               
                            
                        }else{
                            component.set("v.previousLocation", '');
                            if(component.get("v.fromButton")){
                                component.set("v.fromButton", false);
                                component.set("v.initUom", '');
                            }
                            
                        }
                    } else {
                        var errorsVal = a.getError();
                        if (errorsVal) {
                            this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        } 
                    }
                });
                $A.enqueueAction(previousAudit);
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        } catch(e){
            this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    /**
   @Author Accenture
   @name displayToast
   @CreateDate  9/13/2018
   @Description Function displays toast message in Desktop.
  */
    displayToast: function (title, message, type, duration) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toastMsg) {
                // fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
        } catch(e){
            
        }
    },
    /**
   @Author Accenture
   @name showallAuditItems
   @CreateDate  9/13/2018
   @Description Function retrieves all related audit items.
  */    
    showallAuditItems : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getallAudititems");
                action.setParams({
                    brandPackId : component.get("v.brandPackId") 
                });
                action.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var allValues = response.getReturnValue();
                        component.set("v.auditItemList", response.getReturnValue());
                    }
                });
                $A.enqueueAction(action);
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        } catch(e){
            this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    /**
   @Author Accenture
   @name fetchAuditItem
   @CreateDate  9/13/2018
   @Description Function opens the selected audit item for editing.
  */
    fetchAuditItem : function(component, event, helper) {
        var action = component.get("c.getAuditItem"); 
        action.setParams({ 
            auditId:  component.get("v.editAuditId")                                 
        });
        action.setCallback(this, function (data) {
            if (data.getState() === "SUCCESS") {
                component.set("v.editAuditObj", data.getReturnValue());
                component.set("v.showSpinner", false); 
                component.set("v.showEditaudit", true);
            }
            else {
                var errorsVal = data.getError();
                if (errorsVal) {
                    helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                } 
            }
        });
        $A.enqueueAction(action);
    },
    /**
   @Author Accenture
   @name displayToastMobile
   @CreateDate  9/13/2018
   @Description Function displays Toast Message in mobile.
  */
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
            component.set("v.showErrorToast", false);
        }
    }
})