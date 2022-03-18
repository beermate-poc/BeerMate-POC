/*Method to  pass selected user to event attribute
 */
({
	selectUser : function(component, event, helper) {
    //get the selected User from list  
      var getSelectuser = component.get("v.oUser");

    //call the event   
      var compEvent = component.getEvent("oSelectedUserEvent");
        
    //set the Selected User to the event attribute.  
      compEvent.setParams({"userByEvent" : getSelectuser });
        
	//fire the event  
      compEvent.fire();	
	}
    
})