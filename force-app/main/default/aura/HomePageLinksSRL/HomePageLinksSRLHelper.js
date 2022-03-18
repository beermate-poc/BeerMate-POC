({
	loadPage : function(component, event, helper) {
		var action = component.get("c.getCurrentUserId");
        console.log('run');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.managerId", response.getReturnValue());
                console.log('component set to', response.getReturnValue());
                var status = response.getReturnValue();
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);

        var samlAction = component.get("c.getUserSAMLId");
        samlAction.setCallback(this, function (response) {
            var samlState = response.getState();
            if (component.isValid() && samlState === "SUCCESS") {
                component.set("v.SAMLID", response.getReturnValue());
                var samlState = response.getReturnValue();
            }
            else {
                console.log("Failed with state: " + samlState);
            }
        });
        $A.enqueueAction(samlAction);
	}
})