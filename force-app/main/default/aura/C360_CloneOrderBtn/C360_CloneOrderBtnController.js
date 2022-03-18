({
    doInit:function(component,Event,helper){
        helper.iscreate(component,Event,helper);
      /*var Action=component.get("c.getOrderDetail");
      var recordId= component.get("v.recordId");
       Action.setParams(
           {"OrdId":recordId}
       );
       Action.setCallback(this, function(response){ 
           var ResponseValues = response.getState();
           var Result = response.getReturnValue();
            if (ResponseValues === 'SUCCESS') {
                for(var i in Result){
                    if(((i.includes('C360')||i.includes('CTS'))&&(Result[i] === 'Beermate'))||(i === 'System Administrator')){
                        //component.set("v.cloneopen",true);
                    }
                    else {
                        component.set("v.nocloneopen",true);
                    }
                }
            }
       });
    $A.enqueueAction(Action);*/
    },
      
   closeModel: function(component, Event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      var recordId= component.get("v.recordId");
       var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : recordId
        		}).fire();
   }, 
   clone: function(component, Event, helper) {
      // Display alert message on the click on the "Like and Close" button from Model Footer 
      // and set set the "isOpen" attribute to "False for close the model Box.
      // alert('thanks for like Us :)');
      //alert('in clone');
      var Action=component.get("c.cloneOrder");
      var recordId= component.get("v.recordId");
       Action.setParams(
           {"OrdId":recordId}
       );
       Action.setCallback(this, function(response){  
           var ResponseValues = response.getState();
           var Result = response.getReturnValue();
            if (ResponseValues === 'SUCCESS') {
			alert('Order Record Cloned Successfully');
                var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : Result
        		}).fire();
            }
       });
    $A.enqueueAction(Action);
   }, 
    closeError:function(component, Event, helper){
        var recordId= component.get("v.recordId");
        var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : recordId
        		}).fire();
    }
})({
    doInit:function(component,Event,helper){
      var Action=component.get("c.getOrderDetail");
      var recordId= component.get("v.recordId");
       Action.setParams(
           {"OrdId":recordId}
       );
       Action.setCallback(this, function(response){ 
           var ResponseValues = response.getState();
           var Result = response.getReturnValue();
            if (ResponseValues === 'SUCCESS') {
                for(var i in Result){
                    if(((i.includes('C360')||i.includes('CTS'))&&(Result[i] === 'Beermate'))||(i === 'System Administrator')){
                        component.set("v.cloneopen",true);}
                    else {
                        component.set("v.nocloneopen",true);
                    }
                }
            }
       });
    $A.enqueueAction(Action);
    },    
   closeModel: function(component, Event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      var recordId= component.get("v.recordId");
       var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : recordId
        		}).fire();
   }, 
   clone: function(component, Event, helper) {
      // Display alert message on the click on the "Like and Close" button from Model Footer 
      // and set set the "isOpen" attribute to "False for close the model Box.
      // alert('thanks for like Us :)');
      var Action=component.get("c.cloneOrder");
      var recordId= component.get("v.recordId");
       Action.setParams(
           {"OrdId":recordId}
       );
       Action.setCallback(this, function(response){  
           var ResponseValues = response.getState();
           var Result = response.getReturnValue();
            if (ResponseValues === 'SUCCESS') {
			alert('Order Record Cloned Successfully');
                var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : Result
        		}).fire();
            }
       });
    $A.enqueueAction(Action);
   }, 
    closeError:function(component, Event, helper){
        var recordId= component.get("v.recordId");
        var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : recordId
        		}).fire();
    }
})