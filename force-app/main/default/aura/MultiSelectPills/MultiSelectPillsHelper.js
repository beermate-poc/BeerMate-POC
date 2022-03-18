({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   calls the retrieveSearchResults apex method when a search value is entered and
	               returns the results of the search

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	onSearchChange : function(component) {
		if (component.get('v.showMenu')) {
			var spinner = component.find('autoCompleteSpinner');
			$A.util.removeClass(spinner, 'slds-hide');
			component.set('v.loading', true);
			var action = component.get("c.retrieveSearchResults");
			action.setParams({ 
				objectName : component.get('v.object'), 
				search: component.get('v.searchValue'), 
				fieldName: component.get('v.field'),
				filterField: component.get('v.filterField'),
				selectedAnswersToExclude: component.get('v.selectedAnswers').join(',')
			});
			action.setCallback(this, function(response) {
				var state = response.getState();
				var spinner = component.find('autoCompleteSpinner');
				$A.util.addClass(spinner, 'slds-hide');
				component.set('v.loading', false);
				if (state === "SUCCESS") {
					if (response.getReturnValue().length > 0) {
						var results = response.getReturnValue().map(function(property) {
							var JSONproperty = JSON.parse(property);
							return JSONproperty;
						});
						component.set('v.noResults', false);
						component.set('v.results', results);
					} else {
						component.set('v.noResults', true);
						component.set('v.results', []);
					}
				} else if (state === "ERROR") {
					var errors = response.getError();
					if (errors) {
						if (errors[0] && errors[0].message) {
							console.log("Error message: " + 
									errors[0].message);
							alert(errors[0].message);
						}
					} else {
						console.log("Unknown error");
						alert('An error has occured. Please refresh the screen');
					}
				}
			});
			$A.enqueueAction(action);
		} else {
			component.set('v.showMenu', true);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   adds the selected value to the selectedAnswers array which displays the selected
	               answer as a pill in the listbox.  Also fires the SearchValueChange event which reruns
	               the validateFilter method on the TargetCriteria components

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	onSelectOption : function(component, element) {
		component.set('v.showMenu', false);
		var selectedAnswers = component.get('v.selectedAnswers');
		selectedAnswers.push(element.firstChild.firstChild.innerText);
		component.set('v.selectedAnswers', selectedAnswers);
		component.set('v.searchValue', '');
		component.find('inputSearch').getElement().focus();
		var setEvent = $A.get("e.c:SearchValueChange");

		setEvent.setParams({ "selectedValue" : component.get("v.selectedAnswers")});
		setEvent.setParams({ "identifier" : component.get("v.field")});

		setEvent.fire();
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   clears out the results array

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	clearOut: function(component) {
		component.set('v.noResults', false);
		component.set('v.showMenu', false);
		component.set('v.results', []);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   removed a pill from the listbox when the 'X' is clicked. Also fires the SearchValueChange event which reruns
	               the validateFilter method on the TargetCriteria components

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	removePill: function(component, event) {
		var selectedAnswers = component.get('v.selectedAnswers');
		var ansIndex = event.currentTarget.dataset.record;
		selectedAnswers.splice(ansIndex, 1);
		component.set('v.selectedAnswers', selectedAnswers);
		var setEvent = $A.get("e.c:SearchValueChange");

		setEvent.setParams({ "selectedValue" : component.get("v.selectedAnswers")});
		setEvent.setParams({ "identifier" : component.get("v.field")});

		setEvent.fire();
	}
})