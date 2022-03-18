({
	/*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   sets correct css class for mobile/desktop view

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
	doInit : function (component, event, helper) {
		try{
			var dropdown = component.find('dropdown');
			var isMobile = component.get("v.isMobile");
			if(isMobile){
				$A.util.addClass(dropdown, 'slds-dropdown_left');
			} else {
				$A.util.addClass(dropdown, 'slds-dropdown_right');
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   closes open apply objective dropdowns, method is targetable via aura:method 
					so that all ObjectiveListItem components close their dropdowns besides the one clicked

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
	closeApplyMenus : function (component, event, helper){
		try{
			var currComponentId = component.get("v.objType")+component.get("v.index");
			var curDiv = document.getElementById(currComponentId);
			if(currComponentId != event.getParam("divId")){
				curDiv.classList.remove("slds-is-open");
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   Closes the apply objective dropdown of the component, used by ObjectiveListView to close all dropdowns

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
	closeAllMenus : function (component, event, helper){
		try{
			var currComponentId = component.get("v.objType")+component.get("v.index");
			var selectedRecord = component.get("v.selectedRecord");
			var curDiv = document.getElementById(currComponentId);
			if(selectedRecord != currComponentId){
				curDiv.classList.remove("slds-is-open");
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   opens apply objective dropdown and fires event to close any other open dropdowns

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
	toggleMenu: function (component, event, helper) {
		try{
			var ddDiv = document.getElementById(component.get("v.objType")+component.get("v.index"));
			ddDiv.classList.toggle('slds-is-open');
			var evnt = $A.get("e.c:CloseMenus");
			var currId = component.get("v.objType") + component.get("v.index");
			evnt.setParams({"divId" : currId});
			evnt.fire();
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	
	/*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   displays apply to target list view

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
	navigateToApplyToTargetList : function (component, event, helper){
		component.set("v.isTargetListComponent", false);
        // MC-1738: Added to close and modal and Retain User State
         if($A.get("$Browser.formFactor") == 'DESKTOP'){
                     var showObjectiveListView = component.getEvent("ShowObjectiveListView");
                     showObjectiveListView.setParams({    
                         showObjective: true
                     }).fire();

                }
        helper.navigateToComponent(component,event);
	},
	/*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   displays apply to account view

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
	navigateToApplyToAccount : function (component, event, helper) {
		helper.navigateToComponent(component,event);
		component.set("v.isTargetListComponent", true);
	}
})