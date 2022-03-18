({
    requestInfoReimbursement : function(component, event, helper){
        if((component.get("v.comments")).length>255){
            alert('Your comments have exceeded the 255 character limit. Please adjust accordingly.');
        }else{
            var action = component.get("c.needInfoReimbursementAndLines");
            action.setParams({ headerId : component.get("v.recordId"), comments : component.get("v.comments") });
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
        }
    }
})