({
   
    /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:   Method to initialize Reason Code values for Reimbursement Line Item
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/05/2018  Larry A. Cardenas     Initial Creation
    ------------------------------------------------------------*/  
    doInit : function(component, event, helper) {
        try{
            var ReasonCodes = component.get("c.getReasonCodeDisqualifyOptions");
            ReasonCodes.setCallback(this, function(a) {
                if(a.getState() === "SUCCESS"){
                    var ReasonCode = a.getReturnValue();
                    component.set("v.reasoncode", ReasonCode);
                } else {
                    var errorsVal = a.getError();
                    if (errorsVal) {
                        if (errorsVal[0] && errorsVal[0].message) {
                        }
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    }
                }

            });
            $A.enqueueAction(ReasonCodes);
    }
        catch(e){
            
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
         Disqualify : function(component, event, helper){
        helper.SetDisqualifiedReimbursement(component, event, helper);
    }
    })