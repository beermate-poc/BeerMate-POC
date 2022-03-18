({
 /*------------------------------------------------------------
	Author:        Francesca Fong-Choy
	Company:       Accenture
	Description:  method to load initial data for Objectives tab
	<Date>      <Authors Name>     <Brief Description of Change>
	06/14/18	Francesca Fong-Choy 	Initial Creation
	------------------------------------------------------------*/    
	 doInit : function(component, event, helper) {
       try{
           if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                component.set("v.tableStyle",true);
				helper.fetchObjectives(component, event, helper,component.get("v.recordId"),component.get("v.callogId"));
            	helper.fetchGaps(component, event, helper, component.get("v.recordId"));
                helper.fetchOpportunities(component, event, helper, component.get("v.recordId"));
               	helper.fetchChainActivities(component, event, helper, component.get("v.recordId"));
             	window.addEventListener("message", function(event) {
            component.set("v.showGuidedSellingComponent",true);
            component.set("v.showDashboard",false);          
        }, false);
           
           }  else{
               helper.getAccountInformation(helper, component, event, component.get("v.recordId"));
               component.set("v.tableStyle",true);
               helper.fetchObjectives(component, event, helper,component.get("v.recordId"),component.get("v.callogId"));
               //helper.getCallLog(component, event, helper, component.get("v.recordId"));
               helper.fetchGaps(component, event, helper, component.get("v.recordId"));
               helper.fetchOpportunities(component, event, helper, component.get("v.recordId"));
               helper.fetchChainActivities(component, event, helper, component.get("v.recordId"));
               window.addEventListener("message", function(event) {
            component.set("v.showGuidedSellingComponent",true);
            component.set("v.showDashboard",false);          
        }, false);
           
           }        	
			}
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
	    refreshObjectiveTab : function(component, event, helper){
        helper.fetchObjectives(component, event, helper,component.get("v.recordId"),component.get("v.callogId"));            
    },
  NavigateToSellingStoryDB : function(component, event, helper) {
        var DashboardUrl  = event.getParam("DashboardLink");
      	var showDashboard  = event.getParam("showDashboard");
        component.set("v.DashboardLink",DashboardUrl);
        component.set("v.showDashboard",showDashboard);	
     }
})