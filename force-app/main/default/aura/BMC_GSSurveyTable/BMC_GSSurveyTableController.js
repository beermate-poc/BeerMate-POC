({
    doInit : function(component, event, helper) {
        
        try{
            if(navigator.onLine){
                helper.getSurveyTaken(component, event, helper,component.get("v.recordId"));    
                
            }
            else {
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }           
        }
        catch(e){
            
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
        window.addEventListener("message", function(event) {
            component.set("v.showiFrame",false);
            component.set("v.showSurveyTable",true);  
            component.set("v.refresh",true);
        }, false);
    },
    navigateToSurveyPage : function(component, event, helper) {
        var surveyUrl  = event.currentTarget.dataset.record;
        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": surveyUrl
            });
            urlEvent.fire();           
        }
        else{
            component.set("v.mobileSurveyLink",surveyUrl);
            component.set("v.showiFrame",true);
            component.set("v.showSurveyTable",false);
        }
    },
   /* refreshSurvey : function(component, event, helper) { 
        helper.getSurveyTaken(component, event, helper,component.get("v.recordId"));
        component.set("v.refresh",true);
    }*/
    
})