/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
8/8/2017    Nick Serafin       Initial Creation
12/27/2017  Nick Serafin       Added methods to handle edit and delete functionality 
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up the existing list of target user criteria records

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017      Nick Serafin       Initial Creation
	12/27/2017    Nick Serafin       Added call to setupANDORPicklist()
	------------------------------------------------------------*/
	init : function(component, event, helper){
		helper.getExistingTargetCriteria(component);
		helper.validateFilter(component, false);
		helper.setupANDORPicklist(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up the the next list of target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	getNextPage : function(component, event, helper){
		helper.getNextPage(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets the correct tab view based on tab clicked

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	existingCriteriaClick : function(component) {
		$A.util.addClass(component.find("existingTab"), "slds-active");
		$A.util.removeClass(component.find("newTab"), "slds-active");
		$A.util.addClass(component.find("existingContent"), "slds-show");
		$A.util.removeClass(component.find("existingContent"), "slds-hide");
		$A.util.addClass(component.find("newContent"), "slds-hide");
		$A.util.removeClass(component.find("newContent"), "slds-show");
		component.set("v.saveExistingCriteria", true);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets the correct tab view based on tab clicked

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	newCriteriaClick : function(component) {
		$A.util.addClass(component.find("newTab"), "slds-active");
		$A.util.removeClass(component.find("existingTab"), "slds-active");
		$A.util.addClass(component.find("newContent"), "slds-show");
		$A.util.removeClass(component.find("newContent"), "slds-hide");
		$A.util.addClass(component.find("existingContent"), "slds-hide");
		$A.util.removeClass(component.find("existingContent"), "slds-show");
		component.set("v.saveExistingCriteria", false);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   returns the list of target user criteria record list based on the users search value

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017      Nick Serafin       Initial Creation
	12/27/2017    Nick Serafin       updated to make call to validateSearchKey()
	------------------------------------------------------------*/
	searchKeyChange : function(component, event, helper){
		helper.validateSearchKey(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Validates that the filter set for the target criteria record is valid

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	validateFilter : function(component, event, helper){
		if(component.get("v.saveEditCriteria")){
			helper.validateFilter(component, true);
		} else {
			helper.validateFilter(component, false);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Saves the user target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	saveUserCriteria : function(component, event, helper){
		if(component.get("v.saveEditCriteria")){
			helper.saveUserCriteria(component, true);
		} else {
			helper.saveUserCriteria(component, false);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   enables save button

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	enableSaveButton : function(component, event, helper){
		component.set("v.saveDisabled", false);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   checks if enter key was hit while focused in search box or on search button

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	checkButtonPress : function(component, event, helper){
		if (event.keyCode === 13){
			helper.validateSearchKey(component);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   opens edit screen for target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	openEditModal : function(component, event, helper){
		var id = event.currentTarget.dataset.record;
		helper.openModal(component, id);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   closes edit screen for target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	closeEditModal : function(component, event, helper){
		helper.closeModal(component, event, helper);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   opens confirmation for delete of target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	openDeleteConfirmation : function(component, event, helper){
		component.set("v.targetCriteriaId", event.currentTarget.dataset.record);
		component.set("v.showDeleteConfirmation", true);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   closes confirmation for delete of target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	closeDeleteConfirmation : function(component, event, helper){
		component.set("v.targetCriteriaId", "");
		component.set("v.showDeleteConfirmation", false);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   deletes target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	deleteRecord : function(component, event, helper){
		helper.deleteRecord(component, event);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   opens read only screen for target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	openReadOnlyModal : function(component, event, helper){
		component.set("v.readOnly", true);
		var id = event.currentTarget.dataset.record;
		helper.openModal(component, id);
	}
})