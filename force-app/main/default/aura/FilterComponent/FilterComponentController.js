({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the helper to populate the fields based on the passed in SObject and the operators available to select
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	init : function(component, event, helper){
		helper.populateFieldPicklist(component);
		helper.populateOperatorPicklist(component);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls helper when a selection is made
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	onValueChange : function(component, event, helper){
		helper.onValueChange(component);
	}
})