({
	doInit : function(component, event, helper) {
         var outletId='';
        var recordId = component.get('v.recordId');
        var getOutletId = component.get("c.getOutletId");
        getOutletId.setParams({ currentAccountId : recordId });
            getOutletId.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                outletId = response.getReturnValue();
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
         component.set('v.ifmsrc',$A.get("$Label.c.The_Numbers_Dashboard")+outletId);    
        });
        
        $A.enqueueAction(getOutletId);
		
	}

})