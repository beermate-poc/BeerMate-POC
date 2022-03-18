/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
12/14/2017    Nick Serafin       Initial Creation
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Calls the helper.startGeneration() function

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/14/2017    Nick Serafin       Initial Creation
    05/26/2020    Shruti Garg        Calls the stampPDFDetails method 
	------------------------------------------------------------*/
	startGeneration : function(component, event, helper) {
		helper.startGeneration(component);
        helper.stampPDFDetails(component);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   closes the quick action window

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/14/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	cancelGeneration : function(component, event, helper) {
		var dismissActionPanel = $A.get("e.force:closeQuickAction");
		dismissActionPanel.fire();
	}
})