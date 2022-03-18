({
    loadServiceListTable : function(cmp, event, helper) {
        var recordId= cmp.get("v.recordId");
        var action = cmp.get("c.fetchAllService");
        action.setParams({
            "conId":recordId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.data", response.getReturnValue());
                console.log("### : " + JSON.stringify(response.getReturnValue()));
            }
        });
        $A.enqueueAction(action);
    },
    isUserHaveAccess:function(cmp, event, helper) {
        var recordId= cmp.get("v.recordId");
    	var action = cmp.get("c.isUserCanAccess");
        action.setParams({
            "contId":recordId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.isUserAccess", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    showError : function(component, event, helper,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Error',
            message:message,
            duration:' 5000',
            key: 'info_alt',
            type: 'error',
            mode: 'pester'
        });
        toastEvent.fire();
    }
    
	})