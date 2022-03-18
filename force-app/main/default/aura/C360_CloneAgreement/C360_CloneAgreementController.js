({
    doInit:function(component,Event,helper){
       // helper.iscreate(component,Event,helper);
    },
    
    onCancel: function(component, Event, helper) {
        var recordId= component.get("v.recordId");
        var Event = $A.get("e.force:navigateToSObject");
        Event.setParams({
            'recordId' : recordId
        }).fire();
    }, 
    clone: function(component, Event, helper) {
        var recordId = component.get('v.recordId');
        console.log('recordId'+recordId);
        var action = component.get("c.cloneRecord");
       action.setParams({ recordid : recordId });
        action.setCallback(this, function(data) {
            var state = data.getState();
            var Result = data.getReturnValue();
            if(state === 'SUCCESS'){
               var toast = $A.get("e.force:showToast");
                if (toast){
                    //fire the toast event in Salesforce1 and Lightning Experience
                    toast.setParams({
                         "type": "success",
                        //"title": "Agreement",
                        "message": $A.get("$Label.c.C360_CloneSuccess")
                    });
                    toast.fire();
                } 
                var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
                    'recordId' : Result
                }).fire();
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
   
})