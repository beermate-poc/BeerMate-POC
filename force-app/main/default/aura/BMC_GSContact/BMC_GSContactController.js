({
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method to initialse Roles for Contact
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    doInit : function(component, event, helper) {
        try{
            var contactRoles= component.get("c.getContactRoleOptions");
            contactRoles.setCallback(this, function(a) {
                if(a.getState() === "SUCCESS"){
                    var roleValues = a.getReturnValue();
                    //'Distributor Sales Rep' should not be shown to users in the Call Log
                    var indexVal = roleValues.indexOf('Distributor Sales Rep');
                    if (indexVal > -1) {
                        roleValues.splice(indexVal, 1);
                    }
                    component.set("v.roles", roleValues);
                } else {
                    $A.util.addClass(spinner, "slds-hide");
                    var errorsVal = response.getError();
                    if (errorsVal) {
                        if (errorsVal[0] && errorsVal[0].message) {
                        }
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    } else {
                    }				}
            });
            $A.enqueueAction(contactRoles);
            
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method to close Modal
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    cancelModal:function(component,event,helper){
        helper.cancelModal(component,event,helper);
    },
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method for saving the created Contact
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    saveContact:function(component,event,helper){
        try{	
            if(!$A.util.isEmpty(component.find("role").get("v.value"))){
             component.set('v.newContact.Role__c',component.find("role").get("v.value"));
            }
            helper.validateNames(component,event,helper);
            
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    setContactActive : function(component,event,helper){
        component.set("v.newContact.Active__c",component.get("v.activeContact"));
    }
    
})