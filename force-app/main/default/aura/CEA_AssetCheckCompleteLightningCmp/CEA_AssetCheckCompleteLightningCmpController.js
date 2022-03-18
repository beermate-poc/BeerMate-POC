({
	handleActions: function(component, event) {
        
        var closeAction = event.getParam('closeAction');
        console.log('from lightning compont'+closeAction);
        if(closeAction)
        {
            $A.get("e.force:refreshView").fire();
            $A.get("e.force:closeQuickAction").fire();
            $A.get("e.force:refreshView").fire();
            //location.reload();
            
        }
        
    }
})