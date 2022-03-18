({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   calls the onSearchChange helper method when the search value is equal or greater
	               than 2 characters

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	onSearchChange : function(component, event, helper) {
		var searchValue = event.target.value;
		component.set('v.searchValue', searchValue);
		searchValue.length >= 2 ? helper.onSearchChange(component) : helper.clearOut(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   calls the onSelectOption helper method when a results is clicked on

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	onSelectOption: function(component, event, helper) {
		var getElement = event.target;
		if (getElement.parentElement.parentElement.className.indexOf('resultSpan') > -1) {
			getElement = getElement.parentElement.parentElement;
		}
		helper.onSelectOption(component, getElement);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   calls the removePill helper method when a pill's 'X' is clicked on

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	removePill: function(component, event, helper){
		helper.removePill(component, event);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   sets up the read only answer format for the input fields

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/9/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	setupReadOnlyAnswers: function(component){
		var disabled = component.get("v.disabled");
		if(disabled){
			var answers = component.get("v.selectedAnswers");
			component.set("v.readOnlyAnswers", answers.join("; "));
		}
	}
})