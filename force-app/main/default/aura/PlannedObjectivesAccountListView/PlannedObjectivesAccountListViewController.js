({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the helper to get the selected objective information and lists of accounts for the user
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	doInit : function(component, event, helper) {
		helper.getObjectiveList(component, event, helper);
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   selects all the checkboxes in the non target table
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	selectAll : function(component, event){
		try{
			var notTargetCheckboxes = document.getElementsByClassName("notTarget");
			var selectAll = component.get("v.selectAll");
			if(!selectAll){
				for (var i = 0; i < notTargetCheckboxes.length; i++){
					notTargetCheckboxes[i].checked = true;
				}
				component.set("v.selectAll", true);
			} else {
				for (var i = 0; i < notTargetCheckboxes.length; i++){
					notTargetCheckboxes[i].checked = false;
				}
				component.set("v.selectAll", false);
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   gets the selected accounts on the component and calls the helper to apply/unapply objectives to the selected accounts
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	applyObjectiveToAccounts : function(component, event, helper){
		try{
			if(navigator.onLine){
				var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-hide");
				var notTargetCheckboxes = document.getElementsByClassName("notTarget");
				var targetCheckboxes = document.getElementsByClassName("target");
				var notTargetCheckboxesIds = [];
				var targetCheckboxesIds = [];
				for (var i = 0; i < notTargetCheckboxes.length; i++){
					if(notTargetCheckboxes[i].checked == true){
						if(notTargetCheckboxes[i].id != ''){
							var stringId = notTargetCheckboxes[i].id;
							notTargetCheckboxesIds.push(stringId.slice(6, 24));
						}
					}
				}

				for (var i = 0; i < targetCheckboxes.length; i++){
					if(targetCheckboxes[i].checked == false){
						if(targetCheckboxes[i].id != ''){
							var stringId = targetCheckboxes[i].id;
							targetCheckboxesIds.push(stringId.slice(3, 21));
						}
					}
				}
				component.set("v.nonTargetAccIds", notTargetCheckboxesIds);
				component.set("v.targetAccIds", targetCheckboxesIds);
				helper.applyObjectivesToAccount(component, event, helper);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   refreshes page to the objectiveListView component on click of cancel
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	goBack : function(component, event, helper){
	    // MC-1738: Added to close and modal and Retain User State
        if($A.get("$Browser.formFactor") == 'DESKTOP'){
            $A.util.removeClass(component.find("plannedObjectiveList"), "slds-show");
            $A.util.addClass(component.find("plannedObjectiveList"), "slds-hide");
            var showObjectiveListView = component.getEvent("ShowObjectiveListView");
            showObjectiveListView.setParams({    
                showObjective: false
            }).fire();
            var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
            retainUserState_ObjectiveTab.fire(); 
        }
        else{
            $A.get('e.force:refreshView').fire();
        }
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   navigates to selected account record
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
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