/*------------------------------------------------------------
Author:        Alec Klein
Company:       Slalom, LLC
History
6/14/2017      Alec Klein     Initial creation
------------------------------------------------------------*/

({
	/*------------------------------------------------------------
	Author:        Alec Klein
	Company:       Slalom, LLC
	Description:   Calls the helper to perform the initial page load

	History
	6/14/2017      Alec Klein     Initial creation
	------------------------------------------------------------*/
	init : function(component, event, helper) {
		helper.loadPage(component, event, helper);
	}
})