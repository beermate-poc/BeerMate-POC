({
    /**
   @Author Accenture
   @name updateAuidtitem
   @CreateDate  9/13/2018
   @Description Method to update the Audit Item.
  */
    updateAuidtitem: function(component, event, helper) {
        if($A.util.isEmpty(component.get("v.editAuditObj.BMC_UOM__c")) || $A.util.isEmpty(component.get("v.editAuditObj.BMC_Location__c")) ||
           $A.util.isEmpty(component.get("v.editAuditObj.BMC_UI_Quantity__c"))||((component.get("v.editAuditObj.BMC_No_Manufacture_Date__c")=== false) && $A.util.isEmpty(component.get("v.editAuditObj.BMC_Code_Date__c")))) {
            this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Audit_Error"), 'slds-theme_error');
        }
        else if(parseInt(component.get("v.editAuditObj.BMC_UI_Quantity__c")) < 0 ){
            this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Audit_Error"), 'slds-theme_error');
        }
            else{
                component.set("v.showSpinner", true);
                var acTion = component.get("c.updateAuditrecord");
                acTion.setParams({
                    editAuditObj:  component.get("v.editAuditObj")
                });
                this.displayToastMob(component, $A.get("$Label.c.Success"), 'Audit Item Updated!', 'slds-theme_success');
                acTion.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        setTimeout(function() {
                            component.set("v.showSpinner", false);
                        }, 800);
                        if(component.get("v.showEditaudit")===true)
                            component.set("v.showEditaudit", false);
                    }
                    else {
                        var errorsVal = data.getError();
                        if (errorsVal) {
                            this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    }
                });
                $A.enqueueAction(acTion);
            }
    },
    /**
   @Author Accenture
   @name deleteAuidtitem
   @CreateDate  9/13/2018
   @Description Method to delete the Audit Item.
  */
    deleteAuidtitem: function(component, event, helper){
        component.set("v.showSpinner", true);
        var acTion = component.get("c.deleteRetailAudit");
        acTion.setParams({ deleteAuditObj: component.get("v.editAuditObj")                                  
        });
        this.displayToastMob(component, $A.get("$Label.c.Success"), 'Audit Item Deleted', 'slds-theme_success');
        acTion.setCallback(this, function (data) {
            if (data.getState() === "SUCCESS") {
                setTimeout(function() {
                    component.set("v.showSpinner", false);
                }, 800);
                if(component.get("v.showEditaudit")===true)
                    component.set("v.showEditaudit", false);
            }
            else {
                var errorsVal = data.getError();
                if (errorsVal) {
                    this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                    component.set("v.showSpinner", false);
                }
            }
        });
        $A.enqueueAction(acTion);
    },
    /**
   @Author Accenture
   @name displayToastMob
   @CreateDate  9/13/2018
   @Description Method to display toast for Mobile.
  */
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