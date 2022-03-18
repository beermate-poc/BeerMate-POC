({
   doInit : function(component, event, helper){      
    
       var fieldname = component.get("v.assistiveField");
    // set assistive field  
      //alert(fieldname);
       //alert(component.get("v.record."+fieldname));
      component.set("v.assistiveFieldValue",component.get("v.record."+fieldname));
       var field2name = component.get("v.assistiveField2");
    // set assistive field 2 
      
      component.set("v.assistiveField2Value",component.get("v.record."+field2name));
    
    },
    selectRecord : function(component, event, helper){      
    // get the selected record from list  
      var getSelectRecord = component.get("v.record");
    // call the event   
      var compEvent = component.getEvent("selectedRecordEvent");
    // set the Selected sObject Record to the event attribute.  
         compEvent.setParams({"recordSelected" : getSelectRecord });  
    // fire the event  
         compEvent.fire();
    },
})