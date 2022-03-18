({
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   returns where to hunt lists that are active and created by the logged in user
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	loadTargetLists : function(component) {
		try{
			var spinner = component.find("spinner");
			if(navigator.onLine){
				var action = component.get('c.frontloadUsersWhereToHuntRecords');
				action.setCallback(this, function(response){
					if (response.getState() === "SUCCESS"){
						component.set('v.targetLists', response.getReturnValue()); 
						$A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
					} else if (response.getState() === "ERROR"){
						$A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
						var errors = response.getError();
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
				$A.enqueueAction(action);
			} else {
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
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   applys objective to the target accounts related to the selected where to hunt list
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
    applyObjectiveToAccounts : function(component) {
    	try{
			if(navigator.onLine){
		        var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-hide");
		        var targetRadio = document.getElementsByClassName("target");
		        var targetRadioMobile = document.getElementsByClassName("targetMobile");
		        var targetRadioIds = [];
		        for (var i = 0; i < targetRadio.length; i++) {
		            if (targetRadio[i].checked == true) {
		                if (targetRadio[i].id != '') {
		                    var stringId = targetRadio[i].id;
		                    targetRadioIds.push(stringId.slice(3, 21));
		                }
		            }
		        }
		        for (var i = 0; i < targetRadioMobile.length; i++) {
		            if (targetRadioMobile[i].checked == true) {
		                if (targetRadioMobile[i].id != '') {
		                    var stringId = targetRadioMobile[i].id;
		                    targetRadioIds.push(stringId.slice(9, 27));
		                }
		            }
		        }
		        
		        var action = component.get('c.createObjectives');
				action.setParams({ 
		            "targetListId" : targetRadioIds[0],
		            "objectiveId" : component.get("v.objectiveId")
		        });
				action.setCallback(this, function(response){
					if (response.getState() === "SUCCESS"){
						this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.ApplyObj_TargetList_Successfully_Applied"), 'success', '5000');
                        // MC-1738: Added to close and modal and Retain User State
                        if($A.get("$Browser.formFactor") == 'DESKTOP'){
                            $A.util.removeClass(component.find("targetListModal"), "slds-fade-in-open");
                            $A.util.removeClass(component.find("targetListBackdrop"), "slds-backdrop--open");
                            var evtCancelapply = component.getEvent("cancelApplyObjective");
                            evtCancelapply.fire();
                            var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
                            retainUserState_ObjectiveTab.fire();
                        }
                        else
                        {
                            $A.get('e.force:refreshView').fire();
                        }
		                $A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
					} else if (response.getState() === "ERROR"){
		                $A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
						var errors = response.getError();
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
				$A.enqueueAction(action);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
	    	this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
    },
    /*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   unapplys objective to the target accounts related to the selected where to hunt list
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
    removeObjectiveFromAccounts : function(component) {
    	try{
    		if(navigator.onLine){
		    	var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-hide");
		        var targetRadio = document.getElementsByClassName("target2");
		        var targetRadioMobile = document.getElementsByClassName("targetMobile");
		        var targetRadioIds = [];
		        for (var i = 0; i < targetRadio.length; i++) {
		            if (targetRadio[i].checked == true) {
		                if (targetRadio[i].id != '') {
		                    var stringId = targetRadio[i].id;
		                    targetRadioIds.push(stringId.slice(4, 22));
		                }
		            }
		        }
		        for (var i = 0; i < targetRadioMobile.length; i++) {
		            if (targetRadioMobile[i].checked == true) {
		                if (targetRadioMobile[i].id != '') {
		                    var stringId = targetRadioMobile[i].id;
		                    targetRadioIds.push(stringId.slice(10, 28));
		                }
		            }
		        }
		        var action = component.get('c.unapplyTargetLists');
				action.setParams({ 
		            "targetListId" : targetRadioIds[0],
		            "objectiveId" : component.get("v.objectiveId")
		        });
				action.setCallback(this, function(response){
					if (response.getState() === "SUCCESS"){
						this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.ApplyObj_TargetList_Successfully_Unapplied"), 'success', '5000');
                        //MC-1738: Added to close and Model and Retain User State
                        if($A.get("$Browser.formFactor") == 'DESKTOP'){
                            $A.util.removeClass(component.find("targetListModal"), "slds-fade-in-open");
                            $A.util.removeClass(component.find("targetListBackdrop"), "slds-backdrop--open");
                            var evt = component.getEvent("cancelApplyObjective");
                            evt.fire();
                            var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
                            retainUserState_ObjectiveTab.fire();
                        }
                        else
                        {
                            $A.get('e.force:refreshView').fire();
                        }
		                $A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
					} else if (response.getState() === "ERROR"){
		                $A.util.removeClass(spinner, "slds-show");
						$A.util.addClass(spinner, "slds-hide");
						var errors = response.getError();
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
				$A.enqueueAction(action);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
    },
    /*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   returns where to hunt lists based on the search string entered in the search box
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
	searchKeyChange : function(component) {
		try{
			if(navigator.onLine){
				var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-hide");
				var searchKey = component.get("v.searchKey");
				var action = component.get('c.findByNameTargetList');
				action.setParams({ "searchKey": searchKey});
				action.setCallback(this, function(response) {
					if (response.getState() === "SUCCESS"){
						$A.util.addClass(spinner, "slds-hide");
						component.set("v.targetLists", response.getReturnValue());
					} else if (response.getState() === "ERROR"){
						$A.util.addClass(spinner, "slds-hide");
						this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Search_Value_Error_Message"), 'error', '5000');
						var errors = response.getError();
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
				$A.enqueueAction(action);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   displays toast
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
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
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   returns objective information
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/14/2017    Brian Mansfield     Initial Creation
	------------------------------------------------------------*/
    initObjectiveName : function(component) {
    	try{
    		if(navigator.onLine){
		        var action = component.get('c.queryObjectiveName');
				action.setParams({ "objectiveId": component.get("v.objectiveId")});
				action.setCallback(this, function(response) {
					if (response.getState() === "SUCCESS"){
						component.set("v.objectiveName", response.getReturnValue());
					} else if (response.getState() === "ERROR"){
						var errors = response.getError();
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
				$A.enqueueAction(action);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
    }
})