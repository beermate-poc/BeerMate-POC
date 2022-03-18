({
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   clones call plan record
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    init: function (component, event, helper) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.cloneCallPlanServerSide");
        action.setParams({ planId : recordId });
        action.setCallback(this, function(data) {
            var state = data.getState();
            if(state === 'SUCCESS'){
                var newPlanId = data.getReturnValue();
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                      "recordId": newPlanId,
                      "slideDevName": "detail"
                    });
                    navEvt.fire();
                var toast = $A.get("e.force:showToast");
                    if (toast){
                        //fire the toast event in Salesforce1 and Lightning Experience
                        toast.setParams({
                            "title": "Success!",
                            "message": $A.get("$Label.c.Call_Plan_Cloned"),
                            "type": "success"
                        });
                        toast.fire();
                    } else {
                        //your toast implementation for a standalone app here
                        cosole.log('Error');
                    }
            }else if(state === 'ERROR'){
                console.log('Error :', state);
            }
        });
        $A.enqueueAction(action);
    }
})