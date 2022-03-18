({
	doInit : function(cmp, event, helper) {
        debugger;
		helper.loadRecordData(cmp);
	},
    saveReimbursement : function(cmp, event, helper) {
        debugger;
		helper.saveReimbursement(cmp,helper);
	},
    cancelAction : function(cmp, event, helper) {
		var dismissActionPanel = $A.get("e.force:closeQuickAction"); 
		dismissActionPanel.fire(); 
	}
    
})