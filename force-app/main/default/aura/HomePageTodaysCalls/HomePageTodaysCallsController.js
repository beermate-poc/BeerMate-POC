({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the helper to get list of call logs
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	doInit : function(component, event, helper) {
		helper.getCallLogList(component, event, helper);
        helper.getPastDueCount(component, event, helper);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the helper to get the correct call log listview
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	navigateToListView : function(component, event, helper){
		helper.getCallLogListView(component, event, helper);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   navigates to SObject record page
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	navigateToRecord: function (component, event, helper) {
		var accountId = event.currentTarget.dataset.record;
		var navEvt = $A.get("e.force:navigateToSObject");
		navEvt.setParams({
			"recordId": accountId,
			"slideDevName": "related"
		});
		navEvt.fire();
	}
})