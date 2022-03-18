({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   populates field selection picklist
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	populateFieldPicklist : function(component){
		var action = component.get('c.retrieveFields');
		action.setParams({ "objectName": component.get("v.object") });
		action.setCallback(this, function(response){
			if (response.getState() === "SUCCESS"){
				if (response.getReturnValue().length > 0) {
					var results = response.getReturnValue().map(function(property) {
						return JSON.parse(property);
					});
					component.set('v.fields', results);
				}
			}else if (response.getState() === "ERROR"){
				console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   populates operator picklist
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	populateOperatorPicklist : function(component){
		var opts = [
			{ label: $A.get("$Label.c.equals"), value: "equals" },
			{ label: $A.get("$Label.c.contains"), value: "contains" },
			{ label: $A.get("$Label.c.does_not_equal"), value: "does not equal" },
			{ label: $A.get("$Label.c.does_not_contain"), value: "does not contain" },
			{ label: $A.get("$Label.c.greater_than"), value: "greater than" },
			{ label: $A.get("$Label.c.less_than"), value: "less than" }
		];
		component.set('v.operators', opts);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   fires event that is captured by component to know that a change has occured
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	onValueChange : function(component){
		var setEvent = component.getEvent("valueChanged");
		setEvent.setParams({"identifier": "valueChanged"});
		setEvent.fire();
	}
})