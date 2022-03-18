({
	cancel : function(component, event, helper) {
		$A.get("e.force:closeQuickAction").fire();
	}
    ,
    saveObjective: function(component, event, helper) {
        let recId = component.get('v.recordId')
     	let childComponent = component.find("targetUserObj");
        let message = childComponent.saveObjective(recId);
    }
})