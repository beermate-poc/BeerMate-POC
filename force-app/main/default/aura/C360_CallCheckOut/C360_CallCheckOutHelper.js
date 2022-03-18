({
    /* Navigates  user to  detail page of the record*/
    navigate : function(component, event) {
    var  recid= component.get("v.recordId");
    var navEvt = $A.get("e.force:navigateToSObject");
    navEvt.setParams({
    "recordId": recid,
    "slideDevName": "related"
    });
    navEvt.fire();       
    },
    
   callServer : function(component, method,callback,recordid,latitude,longitude) {
       var p = new Promise( $A.getCallback(function(resolve,reject){
        var action=component.get(method);
        action.setParams({latitude:latitude,longitude:longitude,recid:recordid});
           //action.setParams(params);
          
         action.setCallback(this,function(response){
            if(response.getState()=='SUCCESS') {
                resolve( response.getReturnValue() );
                callback.call(this,response);
            }
            if(response.getState()=='ERROR') {
                callback.call(this,response);               
                reject(response.getError());
               
            }
           
							  });
              
          $A.enqueueAction(action);  
    }
	));
        },
                           


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
			if(showToast){
				component.set("v.showToast", true);
			}
			component.set("v.toastType", type);
			component.set("v.toastTitle", title);
			component.set("v.toastMsg", message);
			/*setTimeout(function(){
				component.set("v.showToast", false);
				component.set("v.toastTitle", "");
				component.set("v.toastType", "");
				component.set("v.toastMsg", "");
			}, 3000);*/
		} catch(e){
			console.error(e);
		}
	}
})