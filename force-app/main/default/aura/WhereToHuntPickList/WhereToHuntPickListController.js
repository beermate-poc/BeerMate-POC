({
	/*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   returns where to hunt lists
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	9/12/17    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
	doInit : function(component) {
		var action = component.get("c.queryOptions");
		action.setCallback(this, function(a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				component.set("v.whereToHuntList", a.getReturnValue());
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   returns accounts based on the where to hunt list selected
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	9/12/17    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
	selectChanged : function(component, event, helper){
		var action = component.get("c.getSelectedId");
		var selectedId = component.find('whereToHuntList').get('v.value');
		action.setParams({
		   huntId: selectedId
		});
		action.setCallback(this, function(a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				var acct = a.getReturnValue();
				var event = $A.get("e.c:AccountsLoaded");
                event.setParams({"accounts": acct,"filetrby":$A.get("$Label.c.BMC_WhereToHunt")});
				event.fire();
			}
		});
		$A.enqueueAction(action);
	}
})