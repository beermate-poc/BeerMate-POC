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
       helper.clonehelper(component, Event, helper);
        
    }, 
   
})