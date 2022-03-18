({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the helper to get the selected objective information and account lists for the logged in user
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	getObjectiveList : function(component, event, helper) {
		try{
			if(navigator.onLine){
				var message;
				var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-hide");
				$A.util.addClass(spinner, "slds-show");
				var currentObjectives= component.get("c.getCurrentObjectives");
				currentObjectives.setParams({ objectiveId : component.get("v.selectedObjectiveId")});
				currentObjectives.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						var element = document.getElementById('tableSizeMessage')
						message = element.currentStyle ? element.currentStyle.display :
		                              getComputedStyle(element, null).display;
						var currentObjectives = a.getReturnValue();
						component.set("v.currentObjective", currentObjectives[0]);
						if(message != 'block'){
							var targetAccounts = component.get("c.getAccountList");
							targetAccounts.setParams({ objectiveId : component.get("v.selectedObjectiveId") });
							targetAccounts.setCallback(this, function(a) {
								var state = a.getState();
								if (state === "SUCCESS") {
									var accountWrapper = a.getReturnValue();
									var targetAccounts = accountWrapper.targetedAccountObj;
									var nonTargetAccounts = accountWrapper.notTargetedAccountObj;
									var achievedAccounts = accountWrapper.achievedAccountObj;

									component.set("v.numAchieved", achievedAccounts.length);
									component.set("v.numTargeted", targetAccounts.length);
									component.set("v.numNonTargeted", nonTargetAccounts.length);

									var mainListLength = 0;

									if(targetAccounts.length >= nonTargetAccounts.length && targetAccounts.length >= achievedAccounts.length){
										mainListLength = targetAccounts.length;
									} else if(nonTargetAccounts.length >= targetAccounts.length && nonTargetAccounts.length >= achievedAccounts.length){
										mainListLength = nonTargetAccounts.length;
									} else if(achievedAccounts.length >= nonTargetAccounts.length && achievedAccounts.length >= targetAccounts.length){
										mainListLength = achievedAccounts.length;
									}

									var targetListLength = mainListLength - targetAccounts.length;
									var nonTargetListLength = mainListLength - nonTargetAccounts.length;
									var achievedListLength = mainListLength - achievedAccounts.length;

									if(achievedAccounts.length != mainListLength){
										for(var i = 0; i < achievedListLength; i++){
											var newAccountPlaceholder = {'sobjectType': 'Account'};
											achievedAccounts.push(newAccountPlaceholder);
										}
									}

									if(targetAccounts.length != mainListLength){
										for(var i = 0; i < targetListLength; i++){
											var newAccountPlaceholder = {'sobjectType': 'Account'};
											targetAccounts.push(newAccountPlaceholder);
										}
									}

									if(nonTargetAccounts.length != mainListLength){
										for(var i = 0; i < nonTargetListLength; i++){
											var newAccountPlaceholder = {'sobjectType': 'Account'};
											nonTargetAccounts.push(newAccountPlaceholder);
										}
									}

									component.set("v.achievedList", achievedAccounts);
									component.set("v.targetedList", targetAccounts);
									component.set("v.nonTargetedList", nonTargetAccounts);
									$A.util.removeClass(spinner, "slds-show");
									$A.util.addClass(spinner, "slds-hide");
								}
							});
							$A.enqueueAction(targetAccounts);
						} else {
							$A.util.removeClass(spinner, "slds-show");
							$A.util.addClass(spinner, "slds-hide");
						}
					} else {
						$A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
						var errors = a.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.error("Error message: " + 
											errors[0].message);
							}
							this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
						} else {
							console.error("Unknown error");
						}
					}
				});
				$A.enqueueAction(currentObjectives);
			} else {
				var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-show");
				$A.util.addClass(spinner, "slds-hide");
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   applies objetive to accounts and removes objectives from accounts
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	applyObjectivesToAccount : function(component,event,helper){
		try{
			if(navigator.onLine){
				var targetIds = component.get("v.targetAccIds");
				var nonTargetIds = component.get("v.nonTargetAccIds");
				var sharedObjective = component.get("v.sharedObjective");
				var applyObjectives = component.get("c.applyObjectivesToAccount");
				applyObjectives.setParams({ objectiveId : component.get("v.selectedObjectiveId"), targetIds : component.get("v.targetAccIds"), nonTargetIds : component.get("v.nonTargetAccIds") });
				applyObjectives.setCallback(this, function(a) {
					var state = a.getState();
					var spinner = component.find("spinner"); 
					if (state === "SUCCESS") {
						$A.util.addClass(spinner, "slds-hide");
						if(sharedObjective){
							console.log('in shared success');
							this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Objective_was_Removed"), 'success');
						} else {
							console.log('in personal success');
							this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Objective_was_Applied"), 'success');
						}
                        
                        // MC-1738: Added to close and modal and Retain User State
                        if($A.get("$Browser.formFactor") == 'DESKTOP'){
                            var showObjectiveListView = component.getEvent("ShowObjectiveListView");
                            showObjectiveListView.setParams({    
                                showObjective: false
                            }).fire();
                            var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
                            retainUserState_ObjectiveTab.fire();
                            $A.util.removeClass(component.find("plannedObjectiveList"), "slds-show");
                            $A.util.addClass(component.find("plannedObjectiveList"), "slds-hide");
                        }
                        else{
                            $A.get('e.force:refreshView').fire();
                        }
                        
					} else if (state === "ERROR") {
						$A.util.addClass(spinner, "slds-hide");
						var errors = a.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.error("Error message: " + 
											errors[0].message);
							}
							this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
						} else {
							console.error("Unknown error");
						}
					}
				});
				$A.enqueueAction(applyObjectives);
			} else {
				var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-show");
				$A.util.addClass(spinner, "slds-hide");
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   displays toast
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['Duration'] = duration
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    }
})