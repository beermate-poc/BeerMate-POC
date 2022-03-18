({
	/* This method is called from "New Event" action on Account,the user is navigated to new Event creation page 
	 * with  AccountID   prepopulated*/
    newEvent : function(component, event, helper) {
        window.setTimeout(
    		$A.getCallback(function() {
        	$A.get("e.force:closeQuickAction").fire();
    		}), 0
		);        
       var recordid=component.get("v.recordId");
       var createRecordEvent = $A.get("e.force:createRecord");
       createRecordEvent.setParams({
       "entityApiName": "Event",
       "defaultFieldValues": {
       'WhatId' : recordid
       }
       });
      createRecordEvent.fire();
            
} ,

     /* Automatically call when the component is done waiting for a response to a server request*/ 
    hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : false });
        evt.fire();    
    } ,
    
   /* automatically call when the component is waiting for a response to a server request*/
    showSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : true });
        evt.fire();    
    } ,
	
})