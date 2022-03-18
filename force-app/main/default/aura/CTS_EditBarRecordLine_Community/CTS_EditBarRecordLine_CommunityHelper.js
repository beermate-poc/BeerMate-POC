({
	
    closeQuickActionAndRedirect :function(component, event,recordId) {
        var urlEvent;
            

        urlEvent = $A.get("e.force:navigateToSObject");
        urlEvent.setParams({
                "recordId": recordId
        });
        
        urlEvent.fire();
        $A.get('e.force:refreshView').fire();
    }
})