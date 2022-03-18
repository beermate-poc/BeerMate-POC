/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
6/21/2017    Nick Serafin       Initial Creation
------------------------------------------------------------*/
({  
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets todays date on the page and calls the getUserRoleName function

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       Initial Creation
	2/22/2018	Jacqueline Passehl	Added functionality for editing an existing objective
	------------------------------------------------------------*/
	doInit : function(component, event, helper){
		try{           
			//if newObjective is not null then it means we are editing an existing objective rather than creating a new one
			if(component.get("v.newObjective")){                
				var objectiveNameInput = component.find("objectiveNameEdit");
				if(objectiveNameInput != null){
					setTimeout(function(){ 
						objectiveNameInput.focus();
					}, 1);
				}
			}
			//var today = new Date();
			//component.set("v.plannedObjective.Start_Date__c", today);
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Matt Kelly
	Company:       Slalom, LLC
	Description:   Sets Objective Type list based on if the Premise Type is On or Off,
	If PremiseType is not On/Off then the Objective Type list is disabled till Premise Type is choosen.

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/18/2017    Matt Kelly       Initial Creation
	------------------------------------------------------------*/
	updateObjectiveTypes: function(component, event, helper) {
		var objectivePremiseType = component.get('v.objectivePremiseType');
		var objectiveTypes = '';
		if(objectivePremiseType == "On-Premise") {
			objectiveTypes = [
						{ label: $A.get("$Label.c.Engagement"), value: "Engagement" },
						{ label: $A.get("$Label.c.Create_Objectives_Feature"), value: "Feature" },
						{ label: $A.get("$Label.c.Create_Objectives_Merchandise"), value: "Merchandise" },
						{ label: $A.get("$Label.c.Placement"), value: "Placement" }
                       // { label: $A.get("$Label.c.Sampling"), value: "Sampling" }
					];
			component.set("v.disableObjType", false);
			component.set('v.isOffPrem', false);
		} else if (objectivePremiseType == "Off-Premise"){
			objectiveTypes = [
						{ label: $A.get("$Label.c.Create_Objectives_Display"), value: "Display" },
						{ label: $A.get("$Label.c.Engagement"), value: "Engagement" },
						{ label: $A.get("$Label.c.Create_Objectives_Feature"), value: "Feature" },
						{ label: $A.get("$Label.c.Create_Objectives_Merchandise"), value: "Merchandise" },
						{ label: $A.get("$Label.c.Placement"), value: "Placement" }
						//{ label: $A.get("$Label.c.Create_Objectives_Space"), value: "Space" } Commented this line as part of GB-10486
					];
			component.set('v.disableObjType', false);
			component.set('v.isOffPrem', true);
		} else {
			objectiveTypes = [];
			component.set("v.disableObjType", true);
			component.set('v.objectiveType', '');
		}
		component.set('v.objectiveType', '');
		component.set('v.objectiveTypes', objectiveTypes);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   resets objective record field values

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	7/26/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	resetObjectiveRecord : function(component, event, helper){
		try{
			var today = new Date();
  			var objectiveType = component.get("v.objectiveType");
			component.set("v.plannedObjective", {'sobjectType': 'Planned_Objective__c', 'Start_Date__c': objectiveType.Start_Date__c});
			//MC-1854 Copy Merchandise, Selecting MBO clears MBO field
            component.set("v.newObjective", {'sobjectType': 'Objective__c', 'Objective_Goal__c': '','Description__c': ''});
			if(component.find(objectiveType + "brandSearch") != null){
				var brandComp = component.find(objectiveType + "brandSearch");
				var index = brandComp.length - 1;
				if(brandComp.length > 0){
					component.find(objectiveType + "brandSearch")[index].set("v.searchValue", null);
					if(component.find(objectiveType + "brandSearch")[index].find("selectOptions") != null){
						component.find(objectiveType + "brandSearch")[index].find("selectOptions").set("v.value", null);
					}
				} else {
					component.find(objectiveType + "brandSearch").set("v.searchValue", null);
					if(component.find(objectiveType + "brandSearch").find("selectOptions") != null){
						component.find(objectiveType + "brandSearch").find("selectOptions").set("v.value", null);
					}
				}
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Closes the modal on button press

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	closeModal : function(component, event, helper){
		try{
			if(component.find("objectiveSelectOptions")){
				component.find("objectiveSelectOptions").set("v.value", "Personal");
			}
			var objectiveTypes = [];
			component.set("v.objectivePremiseType", '');
			component.set("v.disableObjType", true);
			component.set('v.objectiveType', '');
			component.set('v.objectiveTypes', objectiveTypes);
			component.set('v.plannedObjType','Personal');
			component.set("v.selectedMBOId",'');
            component.set("v.objectiveSubType",'');            
			if(component.find("MBOPlannedObj")){
				component.find("MBOPlannedObj").set("v.searchValue",'');
			}
			if($A.get("$Browser.formFactor") == 'DESKTOP'){
				if(component.find("personalObjectiveModal")){
					var modal = component.find("personalObjectiveModal");
					$A.util.removeClass(modal, "slds-show");
				}
			} else {
				$A.get('e.force:refreshView').fire();
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets the quantity value if it is empty on the page when the brand is selected

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       Initial Creation
	4/2/2018	 Jacqueline Passehl	Added check for Planned Objective type from event
	------------------------------------------------------------*/
	setAttributeValue : function(component, event, helper){
		try{
			var objectiveType = component.get("v.objectiveType");
			var attrValue = event.getParam("attributeValue");
			if(objectiveType == 'Placement'){
				if(component.find(objectiveType + "quantity") != null){
					var quantityLength = component.find(objectiveType + "quantity");
					var index = quantityLength.length - 1;
					if(quantityLength.length > 0){
						var quantity = component.find(objectiveType + "quantity")[index].get("v.value");
						if(attrValue != null){
							if(quantity == null){
								component.find(objectiveType + "quantity")[index].set("v.value", '1');
							}
						}
					} else {
						var quantity = component.find(objectiveType + "quantity").get("v.value");
						if(attrValue != null){
							if(quantity == null){
								component.find(objectiveType + "quantity").set("v.value", '1');
							}
						}
					}
				}
			}
			//if id field not null then it should be a Planned_Objective__c
			if(event.getParam("id")){
				helper.getObjectFromId(component,event,helper);
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Logic for editing an objective- if it was created with an MBO then set
				   the Id and MBO object attributes
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	4/3/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	handleEditing : function(component,event,helper){
		//only need to do this if the objected was created via MBO
		if(component.get("v.editingObjective") && component.get("v.newObjective.Created_Via_MBO__c")){
			var plannedObj =  component.get("v.newObjective.Planned_Objective__r");
			component.set("v.selectedMBOId",plannedObj.Id);
			component.set("v.MBOobject",plannedObj);
			//if you go to edit, delete the MBO name & cancel this will be null- have to re-query
			if(!component.get("v.MBOobject.Name"))
			{	
				helper.getObjectFromId(component,event,helper);
			}
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Logic for MBO selection- if an MBO is selected then show shared tab
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	4/5/2018    Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	MBOselection : function(component,event,helper){
		var selectedMBO = component.get("v.selectedMBOId");
		if(selectedMBO==''){
			component.set("v.isSharedObjective",false);
			component.set("v.plannedObjType", 'Personal');
		}
		else{
			component.set("v.isSharedObjective",true);
			component.set("v.plannedObjType", 'MBO');
		}
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:  Sets the Planned Objective type (personal or shared)

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	2/26/2018    Jacqueline Passehl     Initial Creation
	4/5/2018	 Jacqueline Passehl		Updated logic for editing vs. adding a new objective
	------------------------------------------------------------*/
	objectiveSelection : function(component,event,helper){
		try{
			var objectiveSelection;           
			if(component.get("v.editingObjective")){
				objectiveSelection = component.find("objectiveSelectOptionsEdit").get("v.value");
			}
			else{
				objectiveSelection = component.find("objectiveSelectOptions").get("v.value");
			}
			component.set("v.plannedObjType", objectiveSelection);
			//If shared or objective is a MBO
			if(objectiveSelection=="Shared" || component.get("v.selectedMBOId")!='')
			{
				component.set("v.isSharedObjective",true);
				component.set("v.toggleApplyUsers",true);
			}
			else if(objectiveSelection=="Personal")
			{
				component.set("v.isSharedObjective",false);
			}
		} catch(e){
			console.error(e);
			helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Calls the validateObjective function

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       Initial Creation
	8/09/2017	 Brian Mansfield	Added param for dup checking
	------------------------------------------------------------*/
	saveObjective : function(component, event, helper){
		helper.validateObjective(component, false);
	}
})