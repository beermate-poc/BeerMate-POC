({
	loadPage : function(component, event, helper) {

		if($A.get("$Browser.isIOS") || $A.get("$Browser.isAndroid")){
			var action = component.get("c.getCurrentUserId");
			action.setCallback(this, function (response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.userId", response.getReturnValue());
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
					console.log(component.get('v.SAMLID'));
				}
				else {
					console.log("Failed with state: " + samlState);
				}
			});
			$A.enqueueAction(samlAction);
		}
	}
})