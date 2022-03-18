/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
8/8/2017    Nick Serafin       Initial Creation
12/27/2017  Nick Serafin       Added methods to handle edit and delete functionality 
------------------------------------------------------------*/
({
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   gets the next set of records to display on the page as the user scrolls down the list

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	getNextPage : function(component){
		var pageNumber = component.get("v.pageNumber");
		var pageSize = component.get("v.pageSize");
		pageNumber++;
		var existingFlag = component.get("v.getExistingFlag");
		var targetCriteriaList = component.get("v.targetCriteriaList");
		if(existingFlag && targetCriteriaList.length <= 10){
			component.set("v.pageNumber", 1);
			pageNumber = 1;
			component.set("v.pageSize", pageSize);
		} else {
			component.set("v.pageNumber", pageNumber);
			component.set("v.pageSize", pageSize);
		}
		this.searchKeyChange(component, pageNumber, pageSize, true);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up the existing list of target user criteria records

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017      Nick Serafin       Initial Creation
	12/27/2017    Nick Serafin       Updated method to return only top 10 target criteria records with most active survey
	                                 assignments
	------------------------------------------------------------*/
	getExistingTargetCriteria : function(component){
		var spinner = component.find("spinner");
		var action = component.get('c.getExistingTargetCriteria');
		action.setParams({ "objectName": "User"});
		action.setCallback(this, function(response){
			if (response.getState() === "SUCCESS"){
				var top10List = [];
				for(var i=0; i<response.getReturnValue().length; i++){
					top10List.push(response.getReturnValue()[i].tarCriteriaObj);
				}
				component.set("v.top10List", top10List);
				component.set('v.targetCriteriaList', response.getReturnValue());
				component.set('v.getExistingFlag', true);
				if(response.getReturnValue().length >= 10){
					component.set("v.viewMoreDisabled", false);
				} else {
					component.set("v.viewMoreDisabled", true);
				}
				$A.util.removeClass(spinner, "slds-show");
				$A.util.addClass(spinner, "slds-hide");
			} else if (response.getState() === "ERROR"){
				$A.util.removeClass(spinner, "slds-show");
				$A.util.addClass(spinner, "slds-hide");
				console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   validates that the search key is not empty before querying the list of target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	validateSearchKey : function(component){
		var isEmpty = $A.util.isEmpty(component.get("v.searchKey"));
		if(!isEmpty){
			component.set("v.getExistingFlag", false);
			component.set("v.pageNumber", 1);
			component.set("v.pageSize", 10);
			this.searchKeyChange(component, 1, 10, false);
		} else {
			var spinner = component.find("spinner");
			$A.util.removeClass(spinner, "slds-hide");
			this.getExistingTargetCriteria(component);
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   returns the list of target user criteria record list based on the users search value

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017      Nick Serafin       Initial Creation
	12/27/2017    Nick Serafin       Updated method to include logic for pagination and top10 target criteria records
	------------------------------------------------------------*/
	searchKeyChange : function(component, pageNumber, pageSize, scroll){
		var spinner = component.find("spinner");
		$A.util.removeClass(spinner, "slds-hide");
		var searchKey = component.get("v.searchKey");
		var action = component.get('c.findByName');
		var top10List = component.get("v.top10List");
		var existingFlag = component.get("v.getExistingFlag");
		var targetCriteriaList = component.get("v.targetCriteriaList");
		if(existingFlag){
			action.setParams({ "searchKey": searchKey,
						   "objectName": "User",
						   "pageNumber": pageNumber,
						   "pageSize": pageSize,
						   "listToExclude": top10List
						});
		} else {
			action.setParams({ "searchKey": searchKey,
						   "objectName": "User",
						   "pageNumber": pageNumber,
						   "pageSize": pageSize
						});
		}
		action.setCallback(this, function(response) {
			if (response.getState() === "SUCCESS"){
				$A.util.addClass(spinner, "slds-hide");
				if(response.getReturnValue().length > 0){
					if(scroll){
						var targetCriteriaRecords = component.get("v.targetCriteriaList");
						var totalRecords = targetCriteriaRecords.concat(response.getReturnValue());
						var sortedTargetCriteriaRecords = totalRecords.sort(function(a, b) {return (b.activeSurveyAssignmentsCount - a.activeSurveyAssignmentsCount)});
						component.set("v.targetCriteriaList", sortedTargetCriteriaRecords);
					} else {
						component.set("v.targetCriteriaList", response.getReturnValue());
					}
					if(response.getReturnValue().length >= 10){
						component.set("v.viewMoreDisabled", false);
					} else {
						component.set("v.viewMoreDisabled", true);
					}
				} else {
					if(!scroll){
						component.set("v.targetCriteriaList", response.getReturnValue());
						if(response.getReturnValue().length >= 10){
							component.set("v.viewMoreDisabled", false);
						} else {
							component.set("v.viewMoreDisabled", true);
						}
					}
					component.set("v.viewMoreDisabled", true);
				}
			} else if (response.getState() === "ERROR"){
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
	8/8/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	validateFilter : function(component, edit){
		var listOfFilters = [];
		var profile = '';
		var department = '';
		var role = '';
		var city = '';
		var title = '';
		var state = '';
		var mgrUsername = '';
		var country = '';
		var division = '';
		if(edit){
			profile = component.find("profileEdit").get("v.selectedAnswers");
			department = component.find("departmentEdit").get("v.selectedAnswers");
			role = component.find("roleEdit").get("v.selectedAnswers");
			city = component.find("cityEdit").get("v.selectedAnswers");
			title = component.find("titleEdit").get("v.selectedAnswers");
			state = component.find("stateEdit").get("v.selectedAnswers");
			mgrUsername = component.find("mgrUsernameEdit").get("v.selectedAnswers");
			country = component.find("countryEdit").get("v.selectedAnswers");
			division = component.find("divisionEdit").get("v.selectedAnswers");
		} else {
			profile = component.find("profile").get("v.selectedAnswers");
			department = component.find("department").get("v.selectedAnswers");
			role = component.find("role").get("v.selectedAnswers");
			city = component.find("city").get("v.selectedAnswers");
			title = component.find("title").get("v.selectedAnswers");
			state = component.find("state").get("v.selectedAnswers");
			mgrUsername = component.find("mgrUsername").get("v.selectedAnswers");
			country = component.find("country").get("v.selectedAnswers");
			division = component.find("division").get("v.selectedAnswers");
		}
		var andORPicklist = component.get("v.andORConditionValue");
		if(profile.length > 0){
			var filterObj = {};
			filterObj['field'] = 'Profile.Name';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = profile.join(',');
			listOfFilters.push(filterObj);
		}
		if(department.length > 0){
			var filterObj = {};
			filterObj['field'] = 'Department';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = department.join(',');
			listOfFilters.push(filterObj);
		}
		if(role.length > 0){
			var filterObj = {};
			filterObj['field'] = 'UserRole.Name';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = role.join(',');
			listOfFilters.push(filterObj);
		}
		if(city.length > 0){
			var filterObj = {};
			filterObj['field'] = 'City';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = city.join(',');
			listOfFilters.push(filterObj);
		}
		if(title.length > 0){
			var filterObj = {};
			filterObj['field'] = 'Title';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = title.join(',');
			listOfFilters.push(filterObj);
		}
		if(state.length > 0){
			var filterObj = {};
			filterObj['field'] = 'State';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = state.join(',');
			listOfFilters.push(filterObj);
		}
		if(mgrUsername.length > 0){
			var filterObj = {};
			filterObj['field'] = 'ManagerUsername__c';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = mgrUsername.join(',');
			listOfFilters.push(filterObj);
		}
		if(country.length > 0){
			var filterObj = {};
			filterObj['field'] = 'Country';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = country.join(',');
			listOfFilters.push(filterObj);
		}
		if(division.length > 0){
			var filterObj = {};
			filterObj['field'] = 'Division';
			filterObj['operator'] = 'contains';
			filterObj['inputVal'] = division.join(',');
			listOfFilters.push(filterObj);
		}

		var action = component.get('c.criteriaRecordQueryCount');
		action.setParams({ filters : JSON.stringify(listOfFilters), objectName : 'User' , sessionId : null, andORPicklist : andORPicklist});
		action.setCallback(this, function(response){
			if (response.getState() === "SUCCESS"){
				var result = response.getReturnValue();
				if(result.isSuccess){
					var errorMessage = component.find('validationMessage');
					var validationMessage = component.get("v.validationMessage");
					validationMessage = '';
					$A.util.removeClass(errorMessage, 'slds-show'); 
					$A.util.addClass(errorMessage, 'slds-hide');
					component.set("v.validationMessage", validationMessage);
					component.set("v.filterValidation", true);
					component.set('v.numOfUsers', result.recordCount);
				} else {
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
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Saves the user target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017      Nick Serafin       Initial Creation
	12/27/2017    Nick Serafin       Updated method to include logic for validating and saving the AND/OR condition picklist value
	------------------------------------------------------------*/
	saveUserCriteria : function(component, edit){
		var saveExistingCriteria = component.get("v.saveExistingCriteria");
		var saveEditCriteria = component.get("v.saveEditCriteria");
		var filterValidation = component.get("v.filterValidation");
		var andORPicklist =  component.get("v.andORConditionValue");
		var listOfFilters = [];
		var apiFilters = '';
		if(!saveExistingCriteria || saveEditCriteria){
			var targetName = component.get("v.targetName");
			var filterDescription = component.get("v.filterDescription");
			var profile = '';
			var department = '';
			var role = '';
			var city = '';
			var title = '';
			var state = '';
			var mgrUsername = '';
			var country = '';
			var division = '';
			if(edit){
				profile = component.find("profileEdit").get("v.selectedAnswers");
				department = component.find("departmentEdit").get("v.selectedAnswers");
				role = component.find("roleEdit").get("v.selectedAnswers");
				city = component.find("cityEdit").get("v.selectedAnswers");
				title = component.find("titleEdit").get("v.selectedAnswers");
				state = component.find("stateEdit").get("v.selectedAnswers");
				mgrUsername = component.find("mgrUsernameEdit").get("v.selectedAnswers");
				country = component.find("countryEdit").get("v.selectedAnswers");
				division = component.find("divisionEdit").get("v.selectedAnswers");
			} else {
				profile = component.find("profile").get("v.selectedAnswers");
				department = component.find("department").get("v.selectedAnswers");
				role = component.find("role").get("v.selectedAnswers");
				city = component.find("city").get("v.selectedAnswers");
				title = component.find("title").get("v.selectedAnswers");
				state = component.find("state").get("v.selectedAnswers");
				mgrUsername = component.find("mgrUsername").get("v.selectedAnswers");
				country = component.find("country").get("v.selectedAnswers");
				division = component.find("division").get("v.selectedAnswers");
			}

			if(profile.length > 0){
				var filterObj = {};
				profile = profile.join(',');
				filterObj['field'] = 'Profile.Name';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = profile;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				profile = profile.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(department.length > 0){
				var filterObj = {};
				department = department.join(',');
				filterObj['field'] = 'Department';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = department;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				department = department.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(role.length > 0){
				var filterObj = {};
				role = role.join(',');
				filterObj['field'] = 'UserRole.Name';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = role;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				role = role.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(city.length > 0){
				var filterObj = {};
				city = city.join(',');
				filterObj['field'] = 'City';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = city;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				city = city.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(title.length > 0){
				var filterObj = {};
				title = title.join(',');
				filterObj['field'] = 'Title';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = title;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				title = title.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(state.length > 0){
				var filterObj = {};
				state = state.join(',');
				filterObj['field'] = 'State';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = state;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				state = state.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(mgrUsername.length > 0){
				var filterObj = {};
				mgrUsername = mgrUsername.join(',')
				filterObj['field'] = 'ManagerUsername__c';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = mgrUsername;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				mgrUsername = mgrUsername.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(country.length > 0){
				var filterObj = {};
				country = country.join(',')
				filterObj['field'] = 'Country';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = country;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				country = country.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}
			if(division.length > 0){
				var filterObj = {};
				division = division.join(',')
				filterObj['field'] = 'Division';
				filterObj['operator'] = 'contains';
				filterObj['inputVal'] = division;
				var inputValues = filterObj['inputVal'].split(',');
				var valueArray = [];
				for(var val in inputValues){
					valueArray.push(inputValues[val].trim());
				}
				filterObj['inputVal'] = valueArray.join('+');
				apiFilters += filterObj['field'] + ',' + filterObj['operator'] + ',' + filterObj['inputVal'] + ';';
				listOfFilters.push(filterObj);
				division = division.split(',').map(function(value){
					return '"' + value.trim() + '"';
				}).join(',');
			}

			if(JSON.stringify(listOfFilters) == '[]'){
				filterValidation = true;
			}
			if(filterValidation){
				if(targetName){
					if(filterDescription && andORPicklist){
						if (apiFilters != '') {
							apiFilters = apiFilters.substring(0, apiFilters.length - 1);
						}
						var spinner = component.find("spinner");
						$A.util.removeClass(spinner, "slds-hide");
						var targetCriteriaObj;
						if(profile.length == 0){
							profile = null;
						}
						if(department.length == 0){
							department = null;
						}
						if(role.length == 0){
							role = null;
						}
						if(city.length == 0){
							city = null;
						}
						if(title.length == 0){
							title = null;
						}
						if(state.length == 0){
							state = null;
						}
						if(mgrUsername.length == 0){
							mgrUsername = null;
						}
						if(country.length == 0){
							country = null;
						}
						if(division.length == 0){
							division = null;
						}
						if(saveEditCriteria){
							targetCriteriaObj = {'sobjectType' : 'Target_Criteria__c', 'Id': component.get("v.targetCriteriaId"), 'Name' : targetName, 'Filter_Description__c' : filterDescription, 'Profile__c' : profile,
												'Department__c' : department, 'Role__c' : role, 'City__c' : city, 'Title__c' : title, 'State__c' : state, 'ManagerUsername__c' : mgrUsername,
												'Country__c' : country, 'Division__c' : division, 'Criteria__c': apiFilters, 'TargetUserCriteriaCondition__c': andORPicklist};
						} else {
							targetCriteriaObj = {'sobjectType' : 'Target_Criteria__c', 'Name' : targetName, 'Filter_Description__c' : filterDescription, 'Profile__c' : profile,
												'Department__c' : department, 'Role__c' : role, 'City__c' : city, 'Title__c' : title, 'State__c' : state, 'ManagerUsername__c' : mgrUsername,
												'Country__c' : country, 'Division__c' : division, 'Criteria__c': apiFilters, 'TargetUserCriteriaCondition__c': andORPicklist};
						}
						var action = component.get('c.insertCriteriaRecord');
						action.setParams({ targetCriteriaRecord : targetCriteriaObj, "recordTypeName" : "User Criteria" });
						action.setCallback(this, function(response){
							if (response.getState() === "SUCCESS"){
								component.set("v.showEditModal", false);
								component.set("v.targetName", '');
								component.set("v.filterDescription", '');
								var emptyArray = [];
								if(edit){
									component.find("profileEdit").set("v.selectedAnswers", emptyArray);
									component.find("departmentEdit").set("v.selectedAnswers", emptyArray);
									component.find("roleEdit").set("v.selectedAnswers", emptyArray);
									component.find("cityEdit").set("v.selectedAnswers", emptyArray);
									component.find("titleEdit").set("v.selectedAnswers", emptyArray);
									component.find("stateEdit").set("v.selectedAnswers", emptyArray);
									component.find("mgrUsernameEdit").set("v.selectedAnswers", emptyArray);
									component.find("countryEdit").set("v.selectedAnswers", emptyArray);
									component.find("divisionEdit").set("v.selectedAnswers", emptyArray);
								} else {
									component.find("profile").set("v.selectedAnswers", emptyArray);
									component.find("department").set("v.selectedAnswers", emptyArray);
									component.find("role").set("v.selectedAnswers", emptyArray);
									component.find("city").set("v.selectedAnswers", emptyArray);
									component.find("title").set("v.selectedAnswers", emptyArray);
									component.find("state").set("v.selectedAnswers", emptyArray);
									component.find("mgrUsername").set("v.selectedAnswers", emptyArray);
									component.find("country").set("v.selectedAnswers", emptyArray);
									component.find("division").set("v.selectedAnswers", emptyArray);
								}
								component.set("v.andORConditionValue", '');
								this.validateFilter(component, false);
								//TODO add newly created criteria record to the available survey record
								if(component.get("v.saveEditCriteria")){
									this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Target_Criteria_Edit_Success"), 'success', '5000');
									component.set("v.saveEditCriteria", false);
								} else {
									this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Target_Criteria_Record_Success_Message"), 'success', '5000');
								}
								$A.util.addClass(component.find("existingTab"), "slds-active");
								$A.util.removeClass(component.find("newTab"), "slds-active");
								$A.util.addClass(component.find("existingContent"), "slds-show");
								$A.util.removeClass(component.find("existingContent"), "slds-hide");
								$A.util.addClass(component.find("newContent"), "slds-hide");
								$A.util.removeClass(component.find("newContent"), "slds-show");
								component.set("v.saveExistingCriteria", true);
								this.getExistingTargetCriteria(component);
							} else if (response.getState() === "ERROR"){
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
		}
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Displays a toast message

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	8/8/2017    Nick Serafin       Initial Creation
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
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Displays a toast message

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	deleteRecord: function (component, event) {
		var tarCriteriaId = component.get("v.targetCriteriaId");
		var action = component.get("c.deleteTargetCriteriaRecord");
		action.setParams({
			"tarCriteriaId" : tarCriteriaId
		});
		action.setCallback(this, function(a) {
			if (a.getState() === "SUCCESS") {
				var targetCriteriaRecords = component.get("v.targetCriteriaList");
				for(var i=0; i<targetCriteriaRecords.length; i++){
					if(targetCriteriaRecords[i].tarCriteriaObj.Id == tarCriteriaId){
						targetCriteriaRecords.splice(i, 1);
					}
				}
				component.set("v.targetCriteriaList", targetCriteriaRecords);
				component.set("v.targetCriteriaId", "");
				component.set("v.showDeleteConfirmation", false);
			}
			else if (a.getState() === "ERROR") {
				$A.log("Errors", a.getError());
				console.log('error');
			}
		});
		$A.enqueueAction(action);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Sets up AND/OR picklist

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	setupANDORPicklist : function (component) {
		var andORPicklist = ['AND', 'OR'];
		component.set("v.andORConditionValues", andORPicklist);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   opens edit screen for target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	openModal : function(component, id){
		component.set("v.targetCriteriaId", id);
		component.set("v.showEditModal", true);
		component.set("v.saveEditCriteria", true);
		var targetCriteriaList = component.get('v.targetCriteriaList');
		for(var i=0; i<targetCriteriaList.length; i++){
			if(targetCriteriaList[i].tarCriteriaObj.Id == id){
				component.set("v.targetName", targetCriteriaList[i].tarCriteriaObj.Name);
				component.set("v.filterDescription", targetCriteriaList[i].tarCriteriaObj.Filter_Description__c);
				component.set("v.andORConditionValue", targetCriteriaList[i].tarCriteriaObj.TargetUserCriteriaCondition__c);
				var userLink = targetCriteriaList[i].tarCriteriaObj.ViewUsers__c;
				userLink = userLink.replace(/<a href="/g,'').replace(/" target="_blank">Run Report<\/a>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
				component.set("v.userReportLink", userLink);
				if(targetCriteriaList[i].tarCriteriaObj.Profile__c){
					component.find("profileEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.Profile__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.Department__c){
					component.find("departmentEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.Department__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.Role__c){
					component.find("roleEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.Role__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.City__c){
					component.find("cityEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.City__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.Title__c){
					component.find("titleEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.Title__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.State__c){
					component.find("stateEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.State__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.ManagerUsername__c){
					component.find("mgrUsernameEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.ManagerUsername__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.Country__c){
					component.find("countryEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.Country__c.split('"').join('').split(','));
				}
				if(targetCriteriaList[i].tarCriteriaObj.Division__c){
					component.find("divisionEdit").set("v.selectedAnswers", targetCriteriaList[i].tarCriteriaObj.Division__c.split('"').join('').split(','));
				}
			}
		}
		this.validateFilter(component, true);
	},
	/*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   closes edit screen for target criteria record

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/27/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
	closeModal : function(component, event, helper){
		var emptyArray = [];
		component.set("v.targetCriteriaId", "");
		component.set("v.targetName", "");
		component.set("v.filterDescription", "");
		component.set("v.userReportLink", "");
		component.find("profileEdit").set("v.selectedAnswers", emptyArray);
		component.find("departmentEdit").set("v.selectedAnswers", emptyArray);
		component.find("roleEdit").set("v.selectedAnswers", emptyArray);
		component.find("cityEdit").set("v.selectedAnswers", emptyArray);
		component.find("titleEdit").set("v.selectedAnswers", emptyArray);
		component.find("stateEdit").set("v.selectedAnswers", emptyArray);
		component.find("mgrUsernameEdit").set("v.selectedAnswers", emptyArray);
		component.find("countryEdit").set("v.selectedAnswers", emptyArray);
		component.find("divisionEdit").set("v.selectedAnswers", emptyArray);
		component.set("v.andORConditionValue", '');
		component.set("v.showEditModal", false);
		component.set("v.saveEditCriteria", false);
		component.set("v.readOnly", false);
		this.validateFilter(component, false);
	}
})