({
    /* Method to  Display Toast message for Desktop*/
    displayToast : function(component,title,message,type){
    var toastEvent = $A.get("e.force:showToast");
    if(toastEvent){
     toastEvent.setParams({
    "title": title,
    "message":message,
    "type":type
    });
    toastEvent.fire();
    $A.get("e.force:closeQuickAction").fire();
    $A.get("e.force:refreshView").fire();
    }
    else{
    // otherwise throw an alert
	//alert(title + ': ' + message);
        $A.get("e.force:closeQuickAction").fire();                                    
    }
   },
    /*Method to  Display Toast message for mobile-Salesforce1*/
	displayToastMobileCallLog: function(component, showToast, title, message, type){
		try{
			var toastEvent = $A.get("e.force:showToast");
    if(toastEvent){
     toastEvent.setParams({
    "title": title,
    "message":message,
    "type":type
    });
    toastEvent.fire();
			//component.set("v.toastType", type);
			//component.set("v.toastTitle", title);
//component.set("v.toastMsg", message);
        $A.get("e.force:closeQuickAction").fire();
        $A.get("e.force:refreshView").fire();}

		} catch(e){
			console.error(e);
		}
	}
})