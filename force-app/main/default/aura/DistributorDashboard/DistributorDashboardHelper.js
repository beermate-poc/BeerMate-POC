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
	Description:   Sets the renderHeader variable to true or false, depending on whether the recordId attribute is populated

	History
	6/14/2017      Alec Klein     Initial creation
	------------------------------------------------------------*/
	loadPage : function(component, event, helper) {
		var recordId = component.get('v.recordId');
		var renderHeader = (recordId == '' || recordId == null);
		component.set('v.renderHeader', renderHeader);
	}
})