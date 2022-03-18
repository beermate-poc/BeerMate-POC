({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   gets the list of call logs for the user
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	getCallLogList : function(component, event, helper) {
		var callLogs = component.get("c.getTodaysCallLogs");
		callLogs.setCallback(this, function(a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				var callLogList = a.getReturnValue();
				component.set("v.callLogList", callLogList);
				if(callLogList.length > 1){
					component.set("v.numOfItems", callLogList.length + ' ' + $A.get("$Label.c.Home_Todays_Call_Items"));
				} else if(callLogList.length == 1){
					component.set("v.numOfItems", callLogList.length + ' ' + $A.get("$Label.c.Home_Todays_Call_Item"));
				} else {
					component.set("v.numOfItems", callLogList.length + ' ' + $A.get("$Label.c.Home_Todays_Call_Items"));
				}
			}
		});
		$A.enqueueAction(callLogs);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   gets the correct call log listview
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	getCallLogListView : function(component,event, helper){
		var action = component.get("c.getListView");
		action.setCallback(this, function(response){
			var state = response.getState();
			if (state === "SUCCESS") {
				var listviews = response.getReturnValue();
				var navEvent = $A.get("e.force:navigateToList");
				navEvent.setParams({
					"listViewId": listviews.Id,
					"listViewName": null,
					"scope": "Call_Log__c"
				});
				navEvent.fire();
			}
		});
		$A.enqueueAction(action);
	},
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   gets the past due count of the call logs for the logged in user
    <Date>      <Authors Name>     <Brief Description of Change>
    7/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
    getPastDueCount : function(component, event, helper) {
        var action = component.get("c.getPastDueCountServerSide");
		action.setCallback(this, function(a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				var count = a.getReturnValue();
				component.set("v.pastDueCount", count);
			}
		});
		$A.enqueueAction(action);
    }
})