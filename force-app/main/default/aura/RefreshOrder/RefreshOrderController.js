({
	doInit : function(component, event, helper) {
		helper.validateRefresh(component, event, helper);
	},
    
    closeModel: function(component, Event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      var recordId= component.get("v.recordId");
       var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : recordId
        		}).fire();
   },
    closeError:function(component, Event, helper){
        var recordId= component.get("v.recordId");
        var Event = $A.get("e.force:navigateToSObject");
                Event.setParams({
            'recordId' : recordId
        		}).fire();
    }
})