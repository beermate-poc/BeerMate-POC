({
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   calls helper to load initial list of where to hunt lists and sets up objective information
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	init : function(component, event, helper){
		helper.loadTargetLists(component);
		helper.initObjectiveName(component);
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   calls helper to load objective information
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
    initObjectiveId : function(component, event, helper) {
    	try{
	        var params = event.getParam('arguments');
	        if (params) {
	            component.set("v.objectiveId", params.objId);
	            helper.initObjectiveName(component);
	        }
	    } catch(e){
	    	console.error(e);
	    	helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
	    }
    },
    /*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   displays the lists available to apply
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	existingCriteriaClick : function(component, event, helper) {
		try{
			$A.util.addClass(component.find("existingTab"), "slds-active");
			$A.util.removeClass(component.find("newTab"), "slds-active");
			$A.util.addClass(component.find("existingContent"), "slds-show");
			$A.util.removeClass(component.find("existingContent"), "slds-hide");
			$A.util.addClass(component.find("newContent"), "slds-hide");
			$A.util.removeClass(component.find("newContent"), "slds-show");
	        component.set("v.applySelected", true);
	    } catch(e){
	    	console.error(e);
	    	helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
	    }
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   displays the lists available to unapply
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	newCriteriaClick : function(component, event, helper) {
		try{
			$A.util.addClass(component.find("newTab"), "slds-active");
			$A.util.removeClass(component.find("existingTab"), "slds-active");
			$A.util.addClass(component.find("newContent"), "slds-show");
			$A.util.removeClass(component.find("newContent"), "slds-hide");
			$A.util.addClass(component.find("existingContent"), "slds-hide");
			$A.util.removeClass(component.find("existingContent"), "slds-show");
	        component.set("v.applySelected", false);
	    } catch(e){
	    	console.error(e);
	    	helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
	    }
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   closes the appluObjectiveToTargetListCmp modal
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
    closeModal : function(component, event, helper) {
        try{
            // MC-1738: Added to close and modal and Retain User State
            if($A.get("$Browser.formFactor") == 'DESKTOP'){
                $A.util.removeClass(component.find("targetListModal"), "slds-fade-in-open");
                $A.util.removeClass(component.find("targetListBackdrop"), "slds-backdrop--open");
                var evtCancelapply = component.getEvent("cancelApplyObjective");
                evtCancelapply.fire();
                var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
                retainUserState_ObjectiveTab.fire();
            }
            else
            {
                $A.get('e.force:refreshView').fire();
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   calls helper to return where to hunt lists based on the search string
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	searchKeyChange : function(component, event, helper){
		var searchKey = component.get("v.searchKey");
		if(searchKey != null || searchKey != ''){
			helper.searchKeyChange(component);
		}
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   calls helper apply objectie to the targeted accounts in the where to hunt list selected
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	applyObjectiveToAccounts : function(component, event, helper){
		helper.applyObjectiveToAccounts(component);
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   calls helper unapply objectie to the targeted accounts in the where to hunt list selected
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
    removeObjectiveFromAccounts : function(component, event, helper) {
        helper.removeObjectiveFromAccounts(component);
    }
})