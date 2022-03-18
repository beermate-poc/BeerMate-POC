({
	init : function(component, event, helper) {
    var recordId = component.get('v.recordId');
         console.log('recordId'+recordId);
    var action = component.get("c.cloneRecord");
        
    action.setParams({ recordid : recordId });
         action.setCallback(this, function(data) {
            var state = data.getState();
            if(state === 'SUCCESS'){
                 //$A.get("e.force:closeQuickAction").fire();
                console.log('success');
                var newCallId = data.getReturnValue();
              //  alert('Record  has been cloned successfully');
                component.set("v.clonedId",newCallId);
                 component.set("v.editnow",true);
            }else if(state === 'ERROR'){
                $A.get("e.force:closeQuickAction").fire();
                var toast = $A.get("e.force:showToast");
                 var errors = data.getError();
                 if (toast){
                        //fire the toast event in Salesforce1 and Lightning Experience
                        toast.setParams({
                            "title": "Error!",
                             "message": errors[0].message,
                            "type": "error"
                        });
                        toast.fire();
                    } 
                
                console.log('Error :', state);
            }
        });
        $A.enqueueAction(action);
    
		
	},
    
  cancelRecord : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                      "recordId": component.get('v.clonedId'),
                      "slideDevName": "detail"
                    });
                    navEvt.fire();
   },
    
     saveRecord : function(component, event, helper) {
        // Save the record
        component.find("edit").get("e.recordSave").fire();
         var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                      "recordId": component.get('v.clonedId'),
                      "slideDevName": "detail"
                    });
                    navEvt.fire();
    },
     showSpinner: function(component, event, helper) {
       // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 
   },
    
 // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
     // make Spinner attribute to false for hide loading spinner    
       component.set("v.Spinner", false);
    }
    
})