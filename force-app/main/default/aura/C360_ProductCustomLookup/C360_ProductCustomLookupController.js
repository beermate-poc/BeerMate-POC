({
   /**to get the selected record from the lookup box **/
    selectRecord : function(component, event, helper){      
    // get the selected record from list  
      var getSelectRecord = component.get("v.oRecord");
      var recX = event.target.getAttribute("data-key");
       component.set("v.prdId",recX);
    // call the event   
      var compEvent = component.getEvent("oSelectedRecordEvent");
    // set the Selected sObject Record to the event attribute.  
       compEvent.setParams({"recordByEvent" : getSelectRecord,
                            "selectedId" : recX});  
    // fire the event 
         compEvent.fire();
    },
})