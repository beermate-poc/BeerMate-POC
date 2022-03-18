/*------------------------------------------------------------
Author:     Jacqueline Passehl
Company:    Slalom, LLC
History
<Date>      <Authors Name>           <Brief Description of Change>
2/13/2018   Jacqueline Passehl       Initial Creation
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   clears out objective and result fields back to default to account for the event that
				   user opens up another objective for editing. Should default back to personal tab from
				   Target Users tab if closed. Also closes the modal on button press

	History
	<Date>      <Authors Name>     		  <Brief Description of Change>
	2/13/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	closeModalAndClearFields: function (component){
		try{
			//clear out objective and reset defaults
			component.set("v.shouldOpenEdit",false);
			component.set("v.editingObjective",false);
			component.set("v.objective", {'sobjectType': 'Objective__c', 'Status__c': 'Not Started', 'Brands__c': '', 'MC_Product__c': '', 'Is_Template__c': '', 'Description__c': ''});
			component.set("v.applyTargetUsers",true);
			component.set("v.isSharedObjective",false);
			component.set("v.titleField",[])
			component.set("v.duplicateFound", null);
			component.set("v.departmentField",[]);
			component.set("v.shouldDisableInput",false);
            component.set("v.calledFromVF",false);
			component.set("v.MBOobject",{'sobjectType': 'Planned_Objective__c'});
			component.set("v.selectedMBOId",'');
			var targetUser = component.find("targetUserObj");
			if(targetUser != null){
				targetUser.set("v.pageNumber", 1);
			}
			//to fix but if adding and then cancel-default back to personal tab
			if(component.get("v.editingObjective")==false){
				var a = component.get('c.objectivesDetailClick');
				$A.enqueueAction(a);
			}
			//call close for personal objective
			var personalObj = component.find("personalObjective");
			personalObj.closeModal();
			if($A.get("$Browser.formFactor") == 'DESKTOP'){
				var modalObjective = component.find("addObjectiveModal");
				var modalObjectiveBackdrop = component.find("addObjectiveModalBackdrop");
				$A.util.removeClass(modalObjective, "slds-fade-in-open");
				$A.util.removeClass(modalObjectiveBackdrop, "slds-backdrop--open");
			} else {
				$A.get('e.force:refreshView').fire();
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Creates a toast msg on the page

	History
	<Date>       <Authors Name>     	<Brief Description of Change>
	2/13/2018   Jacqueline Passehl      Initial Creation
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
					toastParams['duration'] = duration
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
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   See if there is a validation error for each child component (TargetUserObjective & CreateNewPersonalObjective).
				   If user is on a different tab than the validation error is coming from, then display a toast indicating
				   where the error is coming from. 

	History
	<Date>       <Authors Name>     	<Brief Description of Change>
	2/13/2018    Jacquelin Passehl      Initial Creation
	------------------------------------------------------------*/
	checkTabErrors : function (component){
		try{
			var onObjective = component.get("v.onObjectiveTab"); 
			//if on Objective Tab
			if(onObjective){
				//if there is an error for Target User tabs
				if(component.get("v.targetUserValidateError")){
					this.displayToast('Info', $A.get("$Label.c.Error_On_Target_User_Tab"), 'Info');
				}
			}
			//on Target User Tab
			else{
				//if there is an error for the Objectives Detail tab
				if(component.get("v.personalObjValidateError")){
					this.displayToast('Info', $A.get("$Label.c.Error_On_Objective_Details_Tab"), 'Info');
				}
			}
			if(component.get("v.targetUserValidateError")==false && component.get("v.personalObjValidateError")==false){
				component.set("v.errorsOverall",false);
			}
			else{
				component.set("v.errorsOverall",true);
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Calls save methods for each child component (TargetUserObjective & CreateNewPersonalObjective), then
				   checks to see if there was an error coming from either save method. If no errors, insert or update objective.

	History
	<Date>       <Authors Name>     	<Brief Description of Change>
	2/13/2018    Jacqueline Passehl      Initial Creation
	4/5/2018	 Jacqueline Passehl		 Put an if statement around parameter setting to account for selectedMBOId being null
	4/12/2018	 Jacqueline Passehl		 Moved insertion/updating of objective to determineInsert method
	------------------------------------------------------------*/
	saveObjective : function(component,event,helper){
		try{
			var personalObj = component.find("personalObjective");
			var targetUserObj = component.find("targetUserObj");
			//call save method for child component - personal objective
			//pass in objective because the title and department fields get added in targetUserObj
			personalObj.saveObjective();
			targetUserObj.saveObjective();
			//check for errors on both tabs - if no error on either then insert records or update records
			helper.checkTabErrors(component);
			if(component.get("v.editingObjective")){
				helper.determineInsert(component,event,helper,false);
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Ensures that no errors where found, and that no duplicate objective exists before calling
				   insert/update.
	History
	<Date>       <Authors Name>     	<Brief Description of Change>
	4/12/2018	 Jacqueline Passehl		 Initial Creation
	------------------------------------------------------------*/
	determineInsert : function(component,event,helper,duplicateObjective){
		if(!component.get("v.errorsOverall") &&  !duplicateObjective){
			helper.insertOrUpdate(component,event,helper);
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Calls the Apex Controller insertion or update method,
				   passes in selectedMBO if that field is not null. Display toast
				   on if objective was successfully inserted or not.

	History
	<Date>       <Authors Name>     	<Brief Description of Change>
	4/12/2018	 Jacqueline Passehl		 Initial Creation
	------------------------------------------------------------*/
	insertOrUpdate : function(component,event,helper){
		try{
			 var spinner = component.find("spinner");
			 $A.util.removeClass(spinner, "slds-hide");
			if(navigator.onLine){
				var targetUserObj = component.find("targetUserObj");
				var action = component.get("c.insertOrUpdateRecords"); 
				if(component.get("v.selectedMBOId")){
					action.setParams({
						"objective": component.get("v.objective"),
						"parent": component.get("v.plannedObjective"),
						"objectiveType" : component.get("v.objectiveType"),
						"plannedObjectiveType" : component.get("v.plannedObjType"),
						"title" : component.get("v.titleField"),
						"department" : component.get("v.departmentField"),
						"editing" : component.get("v.editingObjective"),
						"toggle" : component.get('v.applyTargetUsers'),
						"delegateId" : component.get("v.delegateUserId"),
                        "calledFromVF" : component.get("v.calledFromVF"),
                        "wthId":component.get("v.wthId"),
						"selectedMBOId" : component.get("v.selectedMBOId")
					});
				}
				else{
					action.setParams({
						"objective": component.get("v.objective"),
						"parent": component.get("v.plannedObjective"),
						"objectiveType" : component.get("v.objectiveType"),
						"plannedObjectiveType" : component.get("v.plannedObjType"),
						"title" : component.get("v.titleField"),
						"department" : component.get("v.departmentField"),
						"editing" : component.get("v.editingObjective"),
						"toggle" : component.get('v.applyTargetUsers'),
                        "calledFromVF" : component.get("v.calledFromVF"),
                        "wthId":component.get("v.wthId"),
						"delegateId" : component.get("v.delegateUserId")
					});
				}
				action.setCallback(this, function(a) {
					if (a.getState() === "SUCCESS") {
						$A.util.addClass(spinner, "slds-hide");
						component.set("v.objectiveId", a.getReturnValue());
						targetUserObj.insertOrRemoveJunction();
						if(component.get("v.editingObjective")){
							this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Objective_Updated"), 'success');
							// MC-1738: Added to close and modal and Retain User State
							if($A.get("$Browser.formFactor") == 'DESKTOP'){
								this.closeModalAndClearFields(component);
								var modalObjective = component.find("addObjectiveModal");
								$A.util.removeClass(modalObjective, "slds-fade-in-open");
								$A.util.removeClass(modalObjective, "slds-backdrop--open");
								var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
								retainUserState_ObjectiveTab.fire();
							} else {
								$A.get('e.force:refreshView').fire();
							}
						} else {
							this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Create_Objectives_Created"), 'success');
							//MC-1738: Added to close and modal and Retain User State
							if($A.get("$Browser.formFactor") == 'DESKTOP'){
								this.closeModalAndClearFields(component);
								var modal = component.find("addObjectiveModal");
								$A.util.removeClass(modal, "slds-fade-in-open");
								$A.util.removeClass(modal, "slds-backdrop--open");
								var retainUserState_ObjectiveTab = component.getEvent("retainUserState_ObjectiveTab");
								retainUserState_ObjectiveTab.fire();
							} else {
								$A.get('e.force:refreshView').fire();
							}
						}
					}
					else if (a.getState() === "ERROR") {
						$A.util.addClass(spinner, "slds-hide");
						this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Create_Objectives_Not_Created"), 'error');
						var errors = a.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.log("Error message: " + 
									errors[0].message);
							}
						} else {
							console.log("Unknown error");
						}
					}
				});
				$A.enqueueAction(action);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	}
})