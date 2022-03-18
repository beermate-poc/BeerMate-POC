({
	  getReimbursments: function(component) {
        var action = component.get('c.getReimbursments');
        // Set up the callback
        
        action.setCallback(this, function(actionResult) {
         component.set('v.reimbursements', actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
		
	},
    
    getURL: function(component){
    var baseURL = window.location.href;
    component.set('v.baseURL', baseURL);

    
},
    getListView: function(component){
        //going to call back to server, do another action
        var action = component.get('c.getListViewId');
        // Set up the callback
       
        action.setCallback(this, function(actionResult) {
         component.set('v.listViewId', actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
        
    }
})