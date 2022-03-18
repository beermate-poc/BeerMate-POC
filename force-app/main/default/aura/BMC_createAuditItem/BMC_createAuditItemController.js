({
    /**
   @Author Accenture
   @name navigateBack
   @CreateDate  9/13/2018
   @Description Function navigates back when cancel button is clicked.
  */
    navigateBack : function(component, event, helper){
        component.set("v.showAudit", false);
        component.set("v.createPack", false);
        component.set("v.openAddPackage", false);         
        component.set("v.refreshBrandPack", true);
        component.set("v.fromButton", false);
    },
    /**
   @Author Accenture
   @name refreshAuditItm
   @CreateDate  9/13/2018
   @Description Function refreshes the related audit item details.
  */
    refreshAuditItm : function(component, event, helper){
        helper.showallAuditItems(component, event, helper);
        },
    /**
   @Author Accenture
   @name saveauditItem
   @CreateDate  9/13/2018
   @Description Function save the details of audit item when save button is clicked.
  */
    saveauditItem : function(component, event, helper){
        if(component.get("v.validateFields")===true){
        component.set("v.auditRecord.BMC_Location__c", component.get("v.previousLocation"));
        component.set("v.auditRecord.BMC_UOM__c", component.get("v.initUom"));
        if($A.util.isEmpty(component.get("v.initUom")) || $A.util.isEmpty(component.get("v.previousLocation")) ||
           $A.util.isEmpty(component.get("v.auditRecord.BMC_UI_Quantity__c")) || ((component.get("v.manufactureDate")=== false) && $A.util.isEmpty(component.get("v.codeDate")))) {
            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Audit_Error"), 'slds-theme_error');
            if(component.get("v.saveAndScan")===true){               
                component.set("v.clearResult", true);                
                component.set("v.listOfSearchRecords", '');
                component.set("v.searchKeyWord", '');
                component.set("v.saveAndScan", false);
            }
        }
        else if(parseInt(component.get("v.auditRecord.BMC_UI_Quantity__c")) <0 ){
            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Audit_Error"), 'slds-theme_error');
        }else{
            component.set("v.showSpinner", true);
            var acTion = component.get("c.saveAuditItem");
            acTion.setParams({
                location:  component.get("v.previousLocation"),
                maufactureDate:  component.get("v.manufactureDate"),
                quantity:  component.get("v.auditRecord.BMC_UI_Quantity__c"),
                uom:  component.get("v.initUom"),
                oor: component.get("v.outofRotation"),
                repackValue: component.get("v.repackValue"),
                damageValue: component.get("v.damageValue"),
                codeDate:component.get("v.codeDate"),
                brandPackId:  component.get("v.brandPackId")
            });
            acTion.setCallback(this, function (data) {
                if (data.getState() === "SUCCESS") {
                    if((component.get("v.saveAndScan")===true)&&(component.get("v.resultFound")===true)){
                        component.set("v.showSpinner", false);
                        component.set("v.validateFields", false);
                        component.set("v.fromButton", false)
                        helper.initCall(component, event, helper, true);
                    }
                    else{
                    setTimeout(function() {
                        if(component.get("v.saveAndScan")!==true){
                           component.set("v.refreshBrandPack", true); 
                            component.set("v.fromButton", false);
                        }
                        component.set("v.showSpinner", false);
                        //component.set("v.refreshBrandPack", true);
                        component.set("v.showAudit", false);
                        component.set("v.resultFound", true);
                    }, 300);
                    }
                }
                else {
                    var errorsVal = data.getError();
                    if (errorsVal) {
                        helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                    }
                }
            });
            $A.enqueueAction(acTion);
        }
        }                        
        component.set("v.validateFields", true);
    },
    /**
   @Author Accenture
   @name saveandNew
   @CreateDate  9/13/2018
   @Description Function saves the details of audit item and opens new audit item page.
  */
    saveandNew : function(component, event, helper){
        component.set("v.auditRecord.BMC_Location__c", component.get("v.previousLocation"));
        component.set("v.auditRecord.BMC_UOM__c", component.get("v.initUom"));
        if($A.util.isEmpty(component.get("v.auditRecord.BMC_UOM__c")) || $A.util.isEmpty(component.get("v.auditRecord.BMC_Location__c")) ||
           $A.util.isEmpty(component.get("v.auditRecord.BMC_UI_Quantity__c")) ||((component.get("v.manufactureDate")=== false) && $A.util.isEmpty(component.get("v.codeDate")))) {
            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Audit_Error"), 'slds-theme_error');
        }
        else if(parseInt(component.get("v.auditRecord.BMC_UI_Quantity__c")) < 0 ){
           helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Audit_Error"), 'slds-theme_error');
        }else{
            component.set("v.showSpinner", true);
            var acTion = component.get("c.saveAuditItem");
            acTion.setParams({
                location:  component.get("v.previousLocation"),
                maufactureDate:  component.get("v.manufactureDate"),
                quantity:  component.get("v.auditRecord.BMC_UI_Quantity__c"),
                uom:  component.get("v.initUom"),
                oor: component.get("v.outofRotation"),
                repackValue: component.get("v.repackValue"),
                damageValue: component.get("v.damageValue"),
                codeDate:component.get("v.codeDate"),
                brandPackId:  component.get("v.brandPackId")
            });
             helper.displayToastMobile(component, $A.get("$Label.c.Success"), $A.get("$Label.c.BMC_AuditCreated"), 'slds-theme_success');
			 acTion.setCallback(this, function (data) {
                if (data.getState() === "SUCCESS") {
                    setTimeout(function() {
                        component.set("v.showSpinner", false);
                         //component.set("v.showAudit", false);
                       helper.initCall(component, event, helper, true);
                    }, 800);
                }
                else {
                    var errorsVal = data.getError();
                    if (errorsVal) {
                        helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                    }
                }
            });
            $A.enqueueAction(acTion);
        }
    },
    /**
   @Author Accenture
   @name doInit
   @CreateDate  9/13/2018
   @Description Function sets the searchKeyWord to null and calls helper to fetch the audit items.
  */
    doInit: function(component, event, helper) {
        component.set("v.searchKeyWord", '');
        helper.initCall(component, event, helper, false);       
        helper.fetchauditItem(component, event, helper);
    },
    /**
   @Author Accenture
   @name openEditAudit
   @CreateDate  9/13/2018
   @Description Function opens the edit audit page for the selected audit item.
  */
    openEditAudit: function(component, event, helper) {
        component.set("v.showSpinner", true);
        component.set("v.editAuditId", event.getSource().get("v.value"));
        helper.fetchAuditItem(component, event, helper);
    },
    /**
   @Author Accenture
   @name refreshPacklist
   @CreateDate  9/13/2018
   @Description Function closes the edit audit page and refreshes the audit items list.
  */
    refreshPacklist:function(component, event, helper) {
        if(component.get("v.showEditaudit")===false){
            helper.showallAuditItems(component, event, helper);
            helper.initCall(component, event, helper, false);
        }
    },
    /**
   @Author Accenture
   @name setcodedateRqrd
   @CreateDate  9/13/2018
   @Description Function sets the code date to not required if there is no manufacture date.
  */
    setcodedateRqrd:function(component, event, helper) {
        if(component.get("v.manufactureDate")===true){
            component.set("v.codeRequired", false);
        }
        if(component.get("v.manufactureDate")===false){
            component.set("v.codeRequired", true);
        }
    }
})