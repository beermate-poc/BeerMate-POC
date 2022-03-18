/*------------------------------------------------------------
Author:        Brian Mansfield
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
6/26/2017    Nick Serafin       added code to the getObjectiveList() function
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   sets the initial objective lists on the page

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       added call to the controller method getSharedObjectives()
	------------------------------------------------------------*/
	getObjectiveList : function(component,event,helper,filterValue) {
		try{
			if(navigator.onLine){
				var spinner = component.find("spinner");
				$A.util.removeClass(spinner, "slds-hide");
				var buttonGroup = component.find("filterBtn");
				for(var i=0; i < buttonGroup.length; i++){
					if(buttonGroup[i].get("v.value") == filterValue){
						buttonGroup[i].set("v.variant", "brand");
					} else {
						buttonGroup[i].set("v.variant", "neutral");
					}
				}
				var coeObjectives= component.get("c.getCoeObjectives");
				coeObjectives.setParams({"filterValue" : filterValue});
				coeObjectives.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						var sortedCOEList = this.setBaseSort(a.getReturnValue(), filterValue);
						component.set("v.coeObjectivesList", sortedCOEList);
						this.getUserInputObjectiveName(component,sortedCOEList,'coeObjectivesList');
					} else {
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
				$A.enqueueAction(coeObjectives);

				var managerObjectives= component.get("c.getManagerObjectives");
				managerObjectives.setParams({"filterValue" : filterValue});
				managerObjectives.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						var sortedManagerList = this.setBaseSort(a.getReturnValue(), filterValue);
						component.set("v.managerObjectivesList", sortedManagerList);
						this.getUserInputObjectiveName(component,sortedManagerList,'managerObjectivesList');
					} else {
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
				$A.enqueueAction(managerObjectives);

				var personalObjectives= component.get("c.getPersonalObjectives");
				personalObjectives.setParams({"filterValue" : filterValue});
				personalObjectives.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						var sortedPersonalList = this.setBaseSort(a.getReturnValue(), filterValue);
						component.set("v.personalObjectivesList", sortedPersonalList);
						this.getUserInputObjectiveName(component,sortedPersonalList,'personalObjectivesList');
					} else {
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
				$A.enqueueAction(personalObjectives);
				
				var assignByMeObjectives= component.get("c.getAssignedByMeObjectives");
				assignByMeObjectives.setParams({"filterValue" : filterValue});
				assignByMeObjectives.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						$A.util.addClass(spinner, "slds-hide");
						var sortedAssignByMeList = this.setBaseSort(a.getReturnValue(), filterValue);
						component.set("v.assignByMeObjectivesList", sortedAssignByMeList);
						this.getUserInputObjectiveName(component,sortedAssignByMeList,'assignByMeObjectivesList');
					} else {
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
				$A.enqueueAction(assignByMeObjectives);
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   goes through list of objectives and if was crated via and MBO, then ensure
				   the display name is corrected. 

				   When an objective is inserted, the name is set 
				   to "plannedObjectiveType + ': ' + parent.Name + ' - ' + objectiveType"
				   So this method splits it up to grab just the parent.Name part which reflects
				   what the user entered in the Name input box.

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	4/4/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	getUserInputObjectiveName : function(component,objList,attrList){
		for (var i = 0; i < objList.length; i++){
			if(objList[i].objective.Created_Via_MBO__c){
			var objName = objList[i].objective.Name;
			var splitObjName = objName.split('-',1);
			var splitObjName2 = splitObjName[0].split(':');
			//if objective name was already spliced once it will only have one element
				if(splitObjName2.length>1)
				{
					objList[i].objective.Name =splitObjName2[1];
				}
			}
		}
		component.set("v." + attrList, objList);
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Calls Apex Method to get current user's role

	History
	<Date>       <Authors Name>     	<Brief Description of Change>
	2/13/2018   Jacqueline Passehl      Initial Creation
	------------------------------------------------------------*/
	getCurrentUserRole : function(component,event,helper){
		var action = component.get("c.getUserRole");
		action.setCallback(this, function(a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				component.set("v.userRole",a.getReturnValue());
			} else {
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
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   sorts the list of records in the respective table based on the filter applied

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/31/2018    Nick Serafin        Initial Creation
	------------------------------------------------------------*/
	setBaseSort : function(objectiveList, filterValue) {
		try{
			var mapped;
			if(filterValue == 'current'){
				mapped = objectiveList.map(function (el, i) {
					return {
						index: i,
						value: el.objective.Planned_Objective__r.End_Date__c.toLowerCase(),
						secondaryValue: el.objective.Planned_Objective__r.Name.toLowerCase()
					};
				});
			} else if(filterValue == 'upcoming'){
				mapped = objectiveList.map(function (el, i) {
					return {
						index: i,
						value: el.objective.Planned_Objective__r.Start_Date__c.toLowerCase(),
						secondaryValue: el.objective.Planned_Objective__r.Name.toLowerCase()
					};
				});
			} else {
				mapped = objectiveList.map(function (el, i) {
					return {
						index: i,
						value: el.objective.Planned_Objective__r.End_Date__c.toLowerCase(),
						secondaryValue: el.objective.Planned_Objective__r.Name.toLowerCase()
					};
				});
			}
			if(mapped != null){
				if(filterValue == 'expired'){
					mapped.sort(function (a, b) {
						return b.value.localeCompare(a.value) || a.secondaryValue.localeCompare(b.secondaryValue)
					});
				} else {
					mapped.sort(function (a, b) {
						return a.value.localeCompare(b.value) || a.secondaryValue.localeCompare(b.secondaryValue)
					});
				}
				var result = mapped.map(function (el) {
					return objectiveList[el.index];
				});
				return result;
			} else {
				return null;
			}
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Brian Mansfield
	Company:       Slalom, LLC
	Description:   sets the hasDSMRole attribute for the page

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	setManagerFlag : function(component, event, helper) {
		try{
			if(navigator.onLine){
				var action = component.get("c.initializeManagerFlag");
				action.setCallback(this, function(response) {
					var state = response.getState();
					if (state === "SUCCESS") {
						component.set("v.hasManagerRole", response.getReturnValue());
					} else {
						var errors = response.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.log("Error message: " + 
									errors[0].message);
							}
							this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
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
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   sorts the list of records in the respective table on click of the column headers

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	1/31/2018    Nick Serafin        Initial Creation
	------------------------------------------------------------*/
	sortBy: function(component, event, helper, field) {
		try{
			var fieldValue = field.split('/'),
				recordTypeFieldName = '',
				fieldName = fieldValue[0],
				listName = fieldValue[1],
				sortAsc = component.get("v." + fieldValue[1] + "SortAsc"),
				sortField = component.get("v." + fieldValue[1] + "SortField"),
				count = false,
				relationship = false,
				recordType = false,
				records = component.get("v." + fieldValue[1] + "ObjectivesList");
			if(fieldValue.length > 2){
				if(fieldValue[2] == 'count'){
					count = true;
				} else if(fieldValue[2] == 'recordType'){
					recordTypeFieldName = fieldName.split(',')[1];
					recordType = true;
				} else {
					relationship = true;
				}
			}
			sortAsc = sortField != fieldName || !sortAsc;
			records.sort(function(a,b){
				var t1, t2;
				if(count){
					t1 = a[fieldName] == b[fieldName],
					t2 = (!a[fieldName] && b[fieldName]) || (a[fieldName] < b[fieldName]);
				} else if(relationship) {
					t1 = a.objective.Planned_Objective__r[fieldName] == b.objective.Planned_Objective__r[fieldName],
					t2 = (!a.objective.Planned_Objective__r[fieldName] && b.objective.Planned_Objective__r[fieldName]) || (a.objective.Planned_Objective__r[fieldName] < b.objective.Planned_Objective__r[fieldName]);
				} else if(recordType){
					t1 = a.objective.RecordType[recordTypeFieldName] == b.objective.RecordType[recordTypeFieldName],
					t2 = (!a.objective.RecordType[recordTypeFieldName] && b.objective.RecordType[recordTypeFieldName]) || (a.objective.RecordType[recordTypeFieldName] < b.objective.RecordType[recordTypeFieldName]);
				} else {
					t1 = a.objective[fieldName] == b.objective[fieldName],
					t2 = (!a.objective[fieldName] && b.objective[fieldName]) || (a.objective[fieldName] < b.objective[fieldName]);
				}
				return t1? 0: (sortAsc?-1:1)*(t2?1:-1);
			});
			component.set("v." + fieldValue[1] + "SortAsc", sortAsc);
			component.set("v." + fieldValue[1] + "SortField", fieldName);
			component.set("v." + fieldValue[1] + "ObjectivesList", records);
		} catch(e){
			console.error(e);
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
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