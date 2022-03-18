/*------------------------------------------------------------
Author:     Jacqueline Passehl
Company:    Slalom, LLC
History
<Date>      <Authors Name>           <Brief Description of Change>
2/13/2018   Jacqueline Passehl       Initial Creation
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   clears out objective and result fields back to default to account for the event that
				   user opens up another objective for editing. Should default back to personal tab from
				   Target Users tab if closed. Also closes the modal on button press

	History
	<Date>      <Authors Name>     		  <Brief Description of Change>
	2/13/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	closeModal : function(component, event, helper){
		helper.closeModalAndClearFields(component, event, helper);
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   handler called when boolean editingObjective attribute is changed

	History
	<Date>      <Authors Name>     		<Brief Description of Change>
	2/22/2018   Jacqueline Passehl       Initial Creation
	3/7/2018	Jacqueline Passehl		 Added a check for if editing an objective & currently logged in user
										 is not the same as who created it, then set a boolean to show input as disabled as
										 objectives should be read-only for those who did not create it.
	------------------------------------------------------------*/
	handleEditing : function(component,event,helper){
		try{
			if(component.get("v.editingObjective")==true){
				//var objCreatedBy = 	component.get("v.objective.CreatedById").slice(0,-3);
				var objCreatedBy = 	component.get("v.objective.CreatedById");
				var currLoggedInUser =	$A.get("$SObjectType.CurrentUser.Id");
				var loggedInUserRole = component.get("v.userRole");
				//should disable editing objectives if user viewing is not the same as who created it
				//OR if the user is not a Sales Admin,as they can edit any objective
				if($A.get("$Browser.formFactor") == 'DESKTOP') {
					if(objCreatedBy==currLoggedInUser || loggedInUserRole == 'Sales Administrator'){
						component.set("v.shouldDisableInput",false);
					} else {
						component.set("v.shouldDisableInput",true);
					}
				} else {
					component.set("v.shouldDisableInput",true);
				}
				if(component.get("v.objective.Planned_Objective__r.Planned_Objective_Type__c")=='Personal'){
					//default back to personal tab incase a personal object was clicked after a shared objective
					var a = component.get('c.objectivesDetailClick');
					$A.enqueueAction(a);
				}
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	 /*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   At the end of the save validation for CreateNewPersonalObjective, it will
				   Check if a duplicate objective already exists. If it does then boolean is set to true-
				   and open the duplicate prompt display and set determineInsert bool to true 
				   to halt calling insert objective. Else set determineInsert bool to false to go straight to insertion

	History
	<Date>      	<Authors Name>     		<Brief Description of Change>
	4/11/2018       Jacqueline Passehl      Initial Creation
	------------------------------------------------------------*/
	duplicateObjHandler : function(component,event,helper){
		if(component.get("v.duplicateFound") == true){
			var duplicateModal = component.find("duplicatePrompt");
			var duplicateBackDrop = component.find("duplicateModalBackdrop");
			if($A.get("$Browser.formFactor") == 'DESKTOP'){
				$A.util.addClass(duplicateModal, "slds-fade-in-open");
				$A.util.addClass(duplicateBackDrop, "slds-backdrop--open");
			} else {
				component.set("v.showDuplicate", true);
			}
			helper.determineInsert(component,event,helper,true);
		} else if(component.get("v.duplicateFound") == false){
			helper.determineInsert(component,event,helper,false);
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   resets the modal view - closes out the duplicate objective prompt

	History
	<Date>      	<Authors Name>     		<Brief Description of Change>
	4/11/2018       Jacqueline Passehl      Initial Creation
	------------------------------------------------------------*/
	promptCancel : function(component, event, helper){
		if($A.get("$Browser.formFactor") == 'DESKTOP'){
			var duplicateModal = component.find("duplicatePrompt");
			var duplicateBackDrop = component.find("duplicateModalBackdrop");
			$A.util.removeClass(duplicateModal, "slds-fade-in-open");
			$A.util.removeClass(duplicateBackDrop, "slds-backdrop--open");
			component.set("v.duplicateFound", null);
		} else {
			component.set("v.showDuplicate", false);
			component.set("v.duplicateFound", null);
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   resets the modal view - closes duplicate objective prompt & 
				   calls the determine insert method with boolean set to false
				   to ignore the duplicate check since a prompt was already displayed to the user.
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	4/11/2018   Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	promptSave : function(component, event, helper){
		component.set("v.duplicatePlannedObjective", null);
		if($A.get("$Browser.formFactor") == 'DESKTOP'){
			var duplicateModal = component.find("duplicatePrompt");
			var duplicateBackDrop = component.find("duplicateModalBackdrop");
			$A.util.removeClass(duplicateModal, "slds-fade-in-open");
			$A.util.removeClass(duplicateBackDrop, "slds-backdrop--open");
			helper.determineInsert(component,event,helper,false);
		} 
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Calls the saveObjective function on button press

	History
	<Date>      <Authors Name>     		<Brief Description of Change>
	2/13/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	saveObjective : function(component,event,helper){
		helper.saveObjective(component,event,helper);
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Switch to the Objective Details tab if tab was clicked. adds slds classes to show
				   or hide content. Also set boolean to indicate which tab the user is viewing.
	History
	<Date>      <Authors Name>     		<Brief Description of Change>
	2/13/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	objectivesDetailClick : function(component, event, helper){
		try{
			$A.util.addClass(component.find("objectivesDetailTab"), "slds-active");
			$A.util.addClass(component.find("objectiveDetailContent"), "slds-show");
			$A.util.removeClass(component.find("objectiveDetailContent"), "slds-hide");
			$A.util.removeClass(component.find("targetUserTab"), "slds-active");
			$A.util.addClass(component.find("targetUserContent"), "slds-hide");
			$A.util.removeClass(component.find("targetUserContent"), "slds-show");
			component.set("v.onObjectiveTab", true);
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Switch to the Target Users tab if tab was clicked. adds slds classes to show
				   or hide content. Also set boolean to indicate which tab the user is viewing.
	History
	<Date>      <Authors Name>     		<Brief Description of Change>
	2/13/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	targetUserClick : function(component, event, helper){
		try{
			$A.util.addClass(component.find("targetUserTab"), "slds-active");
			$A.util.addClass(component.find("targetUserContent"), "slds-show");
			$A.util.removeClass(component.find("targetUserContent"), "slds-hide");
			$A.util.removeClass(component.find("objectivesDetailTab"), "slds-active");
			$A.util.addClass(component.find("objectiveDetailContent"), "slds-hide");
			$A.util.removeClass(component.find("objectiveDetailContent"), "slds-show");
			component.set("v.onObjectiveTab", false);
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	}
})