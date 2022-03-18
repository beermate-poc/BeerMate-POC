({
     doInit : function(component, event, helper) {
        helper.getAccountInfo(component , event);

    },
	uploadCAOutlet : function(component, event, helper) {
		 helper.uploadCAOutlet(component,event,helper);
	},
    gobcktoRcrdpage : function(component, event, helper) {
		 var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "detail",
            "isredirect": false
        });
        navEvt.fire();
	}

})