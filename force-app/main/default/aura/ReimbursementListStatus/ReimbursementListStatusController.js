({
	doInit: function(component, event, helper) {
        // Fetch the reimbursement list from the Apex controller
        helper.getURL(component);
        helper.getListView(component);
        helper.getReimbursments(component);
		
	}
})