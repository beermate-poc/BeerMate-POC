({
	    SetDisqualifiedReimbursement : function(component, event, helper){
        var action = component.get("c.disqualifyReimbursement");
            action.setParams({ headerId : component.get("v.recordId"), reasonCode : component.get("v.selectedCode") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.success", true);
                $A.get('e.force:refreshView').fire();
            }else{
                component.set("v.error", true);
                component.find("errorMsg").set("v.body", response.getError()[0]);
            }
        });
        $A.enqueueAction(action);
    },
     /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:   Method for Display Toast on Desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/10/2018    Larry A. Cardenas     Initial Creation
    ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toast
            
            if (toastMsg) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    title: title,
                    message: message,
                    type: type
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
        } catch(e){
            
        }
    }})