/**
 * Created by alexandria.sanborn on 1/8/2019.
 */
({
    recallReimbursement : function(component, event, helper){
        var action = component.get("c.recallReimbursementAndLines");
        action.setParams({ headerId : component.get("v.recordId") });
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

})