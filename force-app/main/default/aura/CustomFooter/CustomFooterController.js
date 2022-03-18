({
	handleClick : function(component, event, helper) {
        var buttonName = event.getSource().get("v.name");
		var action ="";
   
        if (buttonName.includes('ButtonNext') ){
            if (component.get("v.onFinalPage") == true ){
            	action="FINISH";
            }
         else{
                action="NEXT";
            }              
        } else{
            action="BACK";    
        }
 
        component.set("v.buttonClick", buttonName);
        console.log("action is: "+ action);

        var navigate = component.get('v.navigateFlow');  
        navigate(action); 
		
    },
    onButtonPressed: function(component, event, helper) {
       var OpptyObj = component.get("v.recordId");
   	   var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/"+OpptyObj
        });
        urlEvent.fire();
   }
})