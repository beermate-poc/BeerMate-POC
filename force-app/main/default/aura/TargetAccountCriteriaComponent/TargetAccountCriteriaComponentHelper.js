/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up the existing list of target account criteria records

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	3/5/2018	Jacqueline Passehl	Updated method to include logic for viewing only 10 records at a time
	------------------------------------------------------------*/
	getExistingTargetCriteria: function (component) {
		var spinner = component.find("spinner");
		var action = component.get('c.getExistingTargetCriteria');
		action.setParams({
			"objectName": "Account",
			"pageNumber":  component.get("v.pageNumber"),
			"pageSize":    component.get("v.pageSize")
		});
		action.setCallback(this, function (response) {
			if (response.getState() === "SUCCESS") {
				component.set('v.targetCriteriaList', response.getReturnValue());
				if(response.getReturnValue().length >= component.get("v.pageSize")){
					component.set("v.viewMoreDisabled", false);
				} else {
					component.set("v.viewMoreDisabled", true);
				}
				$A.util.removeClass(spinner, "slds-show");
				$A.util.addClass(spinner, "slds-hide");
			} else if (response.getState() === "ERROR") {
				$A.util.removeClass(spinner, "slds-show");
				$A.util.addClass(spinner, "slds-hide");
				console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   gets the next set of records to display on the page as the user scrolls down the list

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	3/5/2018   Jacqueline Passehl       Initial Creation
	------------------------------------------------------------*/
	getNextPage : function(component){
		 var pageNumber = component.get("v.pageNumber");
		 var pageSize = component.get("v.pageSize");
		 pageNumber++;
		 component.set("v.pageNumber",pageNumber);
		 component.set("v.viewMoreFiltering",true);

		this.searchKeyChange(component, pageNumber, pageSize);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up the map of account fields to use to set filters

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	getFieldsMap: function (component) {
		var action = component.get('c.retrieveFieldsMap');
		action.setParams({
			"objectName": "Account"
		});
		action.setCallback(this, function (response) {
			if (response.getState() === "SUCCESS") {
				component.set('v.fieldMap', response.getReturnValue());
			} else if (response.getState() === "ERROR") {
				console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   returns the list of target account criteria record list based on the users search value

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	3/5/2018	Jacqueline Passehl	Updated method to include logic for viewing only 10 records at a time
	------------------------------------------------------------*/
	searchKeyChange: function (component,pageNumber, pageSize) {

		//if this method is just filtering (View More not clicked)
		if(!pageNumber && !pageSize)
		{
            component.set("v.pageNumber",1);
            component.set("v.viewMoreFiltering",false);
		}

		var spinner = component.find("spinner");
		$A.util.removeClass(spinner, "slds-hide");
		var searchKey = component.get("v.searchKey");
		var action = component.get('c.findByName');
		if(pageNumber && pageSize){
		action.setParams({
			"searchKey": searchKey,
			"objectName": "Account",
			"pageNumber": pageNumber,
			"pageSize": pageSize
		});
		}
		else if(!pageNumber && !pageSize){
			action.setParams({
			"searchKey": searchKey,
			"objectName": "Account",
			"pageNumber": component.get("v.pageNumber"),
			"pageSize": component.get("v.pageSize")
		});
		}
		 var initalList = component.get("v.targetCriteriaList");
		action.setCallback(this, function (response) {;
			if (response.getState() === "SUCCESS") {
				$A.util.addClass(spinner, "slds-hide");
				//if this method is reached on account of clicking view more
				if(component.get("v.viewMoreFiltering")==true){
					var combinedList = initalList.concat(response.getReturnValue());
					combinedList.sort(function(a,b) { 
			    	return new Date(a.tarCriteriaObj.CreatedDate).getTime() - new Date(b.tarCriteriaObj.CreatedDate).getTime() 
					});
					component.set("v.targetCriteriaList",combinedList);


					if(combinedList.length <= component.get("v.pageSize") || response.getReturnValue().length==0){
						component.set("v.viewMoreDisabled",true);
					}
					else{
						component.set("v.viewMoreDisabled",false);
					}
					//finished with logic for View More clicked, so set this back to false
					component.set("v.viewMoreFiltering",false);
				}
				//if this method is reached just by soley filtering
				else{
					component.set("v.targetCriteriaList", response.getReturnValue());

					if(response.getReturnValue().length < component.get("v.pageSize") || response.getReturnValue().length==0){
						component.set("v.viewMoreDisabled",true);
					}
					else{
						component.set("v.viewMoreDisabled",false);
					}
				}

			} else if (response.getState() === "ERROR") {
				$A.util.addClass(spinner, "slds-hide");
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Search_Value_Error_Message"), 'error', '5000');
				console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Validates that the filter set for the target criteria record is valid

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	getUpdatedAccountCount: function (component) {
		var listOfFilters = [];
		var filtersLength = 0;
		var section = component.find("filterRow");
		for (var i = 0; i < section.length; i++) {
			var filterObj = {};
			if ((section[i].find("selectField").get("v.value") != null) && (section[i].find("selectField").get("v.value") != "")) {
				filterObj['field'] = section[i].find("selectField").get("v.value");
				filtersLength++;
			}
			if ((section[i].find("selectOp").get("v.value") != null) && (section[i].find("selectOp").get("v.value") != "")) {
				filterObj['operator'] = section[i].find("selectOp").get("v.value");
				filtersLength++;
			}
			if ((section[i].find("inputVal").get("v.value") != null) && (section[i].find("inputVal").get("v.value") != "")) {
				filterObj['inputVal'] = section[i].find("inputVal").get("v.value");
				filtersLength++;
			}
			if (filterObj['field'] != null && filterObj['operator'] != null && filterObj['inputVal'] != null) {
				listOfFilters.push(filterObj);
			}
		}
		var dynamicRows = component.get("v.body");
		for (var j = 0; j < dynamicRows.length; j++) {
			var filterDynObj = {};
			if ((dynamicRows[j].find("selectField").get("v.value") != null) && (dynamicRows[j].find("selectField").get("v.value") != "")) {
				filterDynObj['field'] = dynamicRows[j].find("selectField").get("v.value");
				filtersLength++;
			}
			if ((dynamicRows[j].find("selectOp").get("v.value") != null) && (dynamicRows[j].find("selectOp").get("v.value") != "")) {
				filterDynObj['operator'] = dynamicRows[j].find("selectOp").get("v.value");
				filtersLength++;
			}
			if ((dynamicRows[j].find("inputVal").get("v.value") != null) && (dynamicRows[j].find("inputVal").get("v.value") != "")) {
				filterDynObj['inputVal'] = dynamicRows[j].find("inputVal").get("v.value");
				filtersLength++;
			}
			if (filterDynObj['field'] != null && filterDynObj['operator'] != null && filterDynObj['inputVal'] != null) {
				listOfFilters.push(filterDynObj);
			}
		}
		if (JSON.stringify(listOfFilters) != '[]' && (listOfFilters.length * 3) == filtersLength) {
			var spinner = component.find("spinner");
			$A.util.removeClass(spinner, "slds-hide");
			var action = component.get('c.criteriaRecordQueryCount');
			action.setParams({
				filters: JSON.stringify(listOfFilters),
				objectName: 'Account'
			});
			action.setCallback(this, function (response) {
				if (response.getState() === "SUCCESS") {
					var result = response.getReturnValue();
					if (result.isSuccess) {
						$A.util.addClass(spinner, "slds-hide");
						var errorMessage = component.find('validationMessage');
						var validationMessage = component.get("v.validationMessage");
						validationMessage = '';
						$A.util.removeClass(errorMessage, 'slds-show'); 
						$A.util.addClass(errorMessage, 'slds-hide');
						component.set("v.validationMessage", validationMessage);
						component.set("v.filterValidation", true);
						component.set('v.numOfAccounts', result.recordCount);
					} else {
						$A.util.addClass(spinner, "slds-hide");
						var errorMessage = component.find('validationMessage');
						var validationMessage = component.get("v.validationMessage");
						validationMessage = result.errorMsg;
						$A.util.removeClass(errorMessage, 'slds-hide'); 
						$A.util.addClass(errorMessage, 'slds-show');
						component.set("v.validationMessage", validationMessage);
						component.set("v.filterValidation", false);
					}
				}
			});
			$A.enqueueAction(action);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Saves the account target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	3/8/2018	Jacqueline Passehl	Added error toast message if no filter criteria
	------------------------------------------------------------*/
	saveAccountCriteria: function (component) {
		var saveExistingCriteria = component.get("v.saveExistingCriteria");
		var filterValidation = component.get("v.filterValidation");
		var listOfFilters = [];
		var apiFilters = '';

		if (!saveExistingCriteria) {
			var targetName = component.get("v.targetName");
			var filterDescription = component.get("v.filterDescription");
			var fieldMap = component.get("v.fieldMap");
			var section = component.find("filterRow");
			for (var i = 0; i < section.length; i++) {
				var filterObj = {};
				if ((section[i].find("selectField").get("v.value") != null) && (section[i].find("selectField").get("v.value") != "")) {
					filterObj['field'] = section[i].find("selectField").get("v.value");
				}
				if ((section[i].find("selectOp").get("v.value") != null) && (section[i].find("selectOp").get("v.value") != "")) {
					filterObj['operator'] = section[i].find("selectOp").get("v.value");
				}
				if ((section[i].find("inputVal").get("v.value") != null) && (section[i].find("inputVal").get("v.value") != "")) {
					filterObj['inputVal'] = section[i].find("inputVal").get("v.value");
				}
				if (filterObj['field'] != null && filterObj['operator'] != null && filterObj['inputVal'] != null) {
					var inputValues = filterObj['inputVal'].split(',');
					var valueArray = [];
					for(var val in inputValues){
						valueArray.push(inputValues[val].trim());
					}
					filterObj['inputVal'] = valueArray.join('+');
					apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
					listOfFilters.push(filterObj);
				}
			}
			var dynamicRows = component.get("v.body");
			for (var j = 0; j < dynamicRows.length; j++) {
				var filterDynObj = {};
				if ((dynamicRows[j].find("selectField").get("v.value") != null) && (dynamicRows[j].find("selectField").get("v.value") != "")) {
					filterDynObj['field'] = dynamicRows[j].find("selectField").get("v.value");
				}
				if ((dynamicRows[j].find("selectOp").get("v.value") != null) && (dynamicRows[j].find("selectOp").get("v.value") != "")) {
					filterDynObj['operator'] = dynamicRows[j].find("selectOp").get("v.value");
				}
				if ((dynamicRows[j].find("inputVal").get("v.value") != null) && (dynamicRows[j].find("inputVal").get("v.value") != "")) {
					filterDynObj['inputVal'] = dynamicRows[j].find("inputVal").get("v.value");
				}
				if (filterDynObj['field'] != null && filterDynObj['operator'] != null && filterDynObj['inputVal'] != null) {
					var inputValues = filterDynObj['inputVal'].split(',');
					var valueArray = [];
					for(var val in inputValues){
						valueArray.push(inputValues[val].trim());
					}
					filterDynObj['inputVal'] = valueArray.join('+');
					apiFilters += filterDynObj['field'] + ',' + filterDynObj['operator'] + ',' + filterDynObj['inputVal'] + ';';
					listOfFilters.push(filterDynObj);
				}
			}
			if(listOfFilters.length>0){
			if (filterValidation) {
				if (targetName) {
					if (filterDescription) {
						if (apiFilters != '') {
							apiFilters = apiFilters.substring(0, apiFilters.length - 1);
						}
						var spinner = component.find("spinner");
						$A.util.removeClass(spinner, "slds-hide");
						var targetCriteriaObj = {
							'sobjectType': 'Target_Criteria__c',
							'Name': targetName,
							'Filter_Description__c': filterDescription,
							'Criteria__c': apiFilters
						};
						var action = component.get('c.insertCriteriaRecord');
						action.setParams({
							targetCriteriaRecord: targetCriteriaObj,
							"recordTypeName": "Account Criteria"
						});
						action.setCallback(this, function (response) {
							if (response.getState() === "SUCCESS") {
								component.set("v.saveDisabled", true);
								$A.util.addClass(spinner, "slds-hide");
								//TODO add newly created criteria record to the available survey record
								this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Target_Criteria_Record_Success_Message"), 'success', '5000');
								$A.get('e.force:refreshView').fire();
								
							} else if (response.getState() === "ERROR") {
								$A.util.addClass(spinner, "slds-hide");
								this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Target_Criteria_Record_Error_Message"), 'error', '5000');
								console.log("Errors", response.getError());
							}
						});
						$A.enqueueAction(action);
					} else {
						this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Filter_Description"), 'warning', '5000');
					}
				} else {
					this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Target_Criteria_Name_Field_Error"), 'warning', '5000');
				}
			} else {
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Filter_Error_Message_Target_Criteria"), 'error', '5000');
			}
		}else{
			this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Filter_Criteria_Missing"), 'error', '5000');
		}
	} else {
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
				//TODO add selected existing criteria to available survey record
				console.log(targetRadioIds);
				if (JSON.stringify(targetRadioIds) == '[]') {
					this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.User_Criteria_Save_Existing_Error"), 'warning', '5000');
				} else {
					this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Criteria_Record_Added"), 'success', '5000');
					$A.get('e.force:refreshView').fire();
					
				}
			}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Displays a toast message

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	------------------------------------------------------------*/
	displayToast: function (title, message, type, duration) {
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
	}
})