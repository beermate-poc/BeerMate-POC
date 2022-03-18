({
     /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method to initialise contacts and accounts to be dispalyed
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
	doInit : function(component, event, helper) {
        try{
                component.set("v.tableStyle",true);
                helper.fecthRelatedContacts(component, event, helper,component.get("v.recordId"));	
                helper.fetchRelatedDistributorOwners(component, event, helper,component.get("v.recordId")); 
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
	 /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method for refreshing the component
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    refreshContactTab  : function(component, event, helper){
        try{
            var refershContacts = component.get("v.refershContacts");
            if(refershContacts){
                helper.fecthRelatedContacts(component, event, helper,component.get("v.recordId")); 
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
	 /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method for editing the customer contact
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    getContactToEdit : function(component, event, helper){
        try{
            component.set("v.contactToGS",component.get("v.contactToEdit"));
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    callAccountOwner : function(component, event, helper){
        var finalAcctIds  =[];
        if(!$A.util.isEmpty(component.get("v.distAccountId"))){  
            finalAcctIds =component.get("v.distAccountId").concat(component.get("v.recordId"));
            helper.fecthRelatedAccountOwners(component, event, helper,finalAcctIds); 
        }else{
            finalAcctIds = component.get("v.recordId");
           helper.fecthRelatedAccountOwners(component, event, helper,finalAcctIds);  
        }
    }
    
})