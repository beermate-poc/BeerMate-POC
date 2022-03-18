({
	doInit  : function(component, event, helper) {
        
         var createCellarLineItemEvent = $A.get("e.force:createRecord");
        createCellarLineItemEvent.setParams({            
            "entityApiName": "Asset",
            "defaultFieldValues": {
                'LocationId' : component.get("v.recordId")
            }
        });
        setTimeout(function(){ $A.get("e.force:closeQuickAction").fire(); }, 1);  
        createCellarLineItemEvent.fire();
	}
})