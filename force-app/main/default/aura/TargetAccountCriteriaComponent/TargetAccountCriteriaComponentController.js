/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up the existing list of target account criteria records and the Map of Account fields

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	init : function(component, event, helper){
		helper.getExistingTargetCriteria(component);
		helper.getFieldsMap(component);
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Sets up the the next list of target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	3/5/2018   Jacqueline Passehl      Initial Creation
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
	Description:   returns the list of target account criteria record list based on the users search value

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	searchKeyChange : function(component, event, helper){
		var searchKey = component.get("v.searchKey");
		if(searchKey != null || searchKey != ''){
			helper.searchKeyChange(component);
		} else {
			helper.getExistingTargetCriteria(component);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   adds filter row to allow for additional filters set

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	addFilter : function(component, event, helper){
		var fieldCount = component.get("v.fieldCount");
		fieldCount++;
		if(fieldCount <= 20){
			$A.createComponent(
				"c:FilterComponent",
				{
					"aura:id" : "filterRow",
					"object" : "Account",
					"fieldCount" : fieldCount
				},
				function(newRow, status, errorMessage){
					if (status === "SUCCESS") {
						component.set("v.fieldCount", fieldCount);
						var body = component.get("v.body");
						body.push(newRow);
						component.set("v.body", body);
					}
					else if (status === "INCOMPLETE") {
						console.log("No response from server or client is offline.")
					}
					else if (status === "ERROR") {
						console.log("Error: " + errorMessage);
					}
				}
			);
		} else {
			helper.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Max_Num_Filter_Error_Message"), 'warning', '5000');
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Validates that the filter set for the target criteria record is valid

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	updateAccountNumber : function(component, event, helper){
		helper.getUpdatedAccountCount(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Saves the account target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	saveAccountCriteria : function(component, event, helper){
		helper.saveAccountCriteria(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   enables save button

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	enableSaveButton : function(component, event, helper){
		component.set("v.saveDisabled", false);
	}
})