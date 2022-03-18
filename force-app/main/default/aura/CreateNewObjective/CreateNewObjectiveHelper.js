({
	resetPage : function(component, event, helper)  {
		var recordId = component.get("v.recordId");
       var evt = component.getEvent("EditObjectiveSucess"); 
                      
            evt.setParams({"selectedObjectiveId" :recordId,"isSaved":true} ); 
        evt.fire();
	},
    cancelPage : function(component, event, helper)  {
		var recordId = component.get("v.recordId");
       var evt = component.getEvent("EditObjectiveSucess"); 
                       
        evt.setParams({"selectedObjectiveId" :recordId,"isSaved":false} ); 
        evt.fire();
	}
})