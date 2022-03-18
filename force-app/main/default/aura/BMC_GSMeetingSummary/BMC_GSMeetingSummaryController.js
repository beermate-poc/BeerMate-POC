({
    init : function(component, event, helper){
     //var pageReference = component.get("v.pageReference"); 
    },
    
    saveCallSummary : function(component, event, helper) {
	helper.recordCallLogGeolocation(component, helper, 'end');
    helper.saveSummary(component, event, true,helper,component.find("userSummary").get("v.value"));
	}
})