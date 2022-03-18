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
    Description:   Closes the edit or delete objective dropdown of the component, used by ObjectiveListView to close all dropdowns

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
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Sets flags and assigns values to indicate opening editing objective modal-
    			   setting shouldOpenEdit to true will trigger handler in ObjectiveListView to call openObjectiveEditModal()

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    3/28/2018 	Jacqueline Passehl  Inital Creation
    ------------------------------------------------------------*/
	setupObjEditFlags : function (component, event, helper){
		var objId = component.get("v.objective.Id");

		if(component.get("v.objType")=='editingPersonal'){
			objId+='personal'
		}
		else if(component.get("v.objType")==='editingAssignByMe'){
			objId+='assignByMe';
		}
		//set objectiveId for editing
		component.set("v.objectiveId",objId);
		component.set("v.shouldOpenEdit", true);

	},
	/*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   calls deleteObjective helper method

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    3/29/2018	Jacqueline Passehl  Inital Creation
    ------------------------------------------------------------*/
	initiateDelete : function (component, event, helper){
		helper.initiateDelete(component,event,helper);
	}
})