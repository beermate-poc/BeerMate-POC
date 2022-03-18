({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   returns the list of objectives for the account and call log and sets the package for the objective types that need a package
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    loadPage: function (component, event, helper) {
        try{
            if(navigator.onLine){
                this.setDeclinedValues(component);
                var action = component.get("c.getObjectives");
                // Set the accountid
                action.setParams({ accountId: component.get("v.accountId"), callLogId: component.get("v.callLogId") });
                // Add callback behavior for when response is received
                action.setCallback(this, function (response) {
                    var selectedStatus = '';
                    var state = response.getState();
                    if (component.isValid() && state === "SUCCESS") {
                        if(typeof response.getReturnValue() != 'undefined' && response.getReturnValue().length > 0){
                        
                            var result = response.getReturnValue();
                            
                            for(var obj in result){
 
                               if(result[obj].Date__c){
                              var time =new Date(result[obj].Date__c);
                                     
                              		result[obj].Currenttime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
                                   //console.log('Currenttime' + result[obj].Currenttime +' '+);
                                   
                                }
                              
                            }
							
                            component.set("v.objectives", result);
                            var brandName = component.find('brandSearch');
                            if(brandName){
                                this.setPackage(component, event, helper);
                            }
                        }
                        var setEvent = component.getEvent("doneLoading");
                        setEvent.fire();
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                component.set("v.showToastObjective", true);
                                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                                component.set("v.toastType", 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    component.set("v.showToastObjective", true);
                    component.set("v.toastTitle", $A.get("$Label.c.Error"));
                    component.set("v.toastMsg", $A.get("$Label.c.Internet_Connection_Error_Msg"));
                    component.set("v.toastType", 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets package on the ui based on the MC_Product__c saved to the objective
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setPackage: function(component, event, helper){
        try{
            if(navigator.onLine){
                var c = component.get("v.objectives");
                console.log(JSON.stringify(c));
                var offPrem = component.get('v.accountIsOffPremise');
                var brand = [].concat(component.find('brandSearch'));
                brand.forEach(function (objective) {
                    if(objective.get('v.searchValue')){
                        if(objective.get('v.showPkg')){                           
                            var brandName = objective.get('v.searchValue').trim();
                            var selectedPkg = objective.get('v.selectedPkgId');
                            var fieldname=objective.get('v.field');                            
                            if (offPrem) {
                                if(fieldname=='TrademarkBrandLongNme__c')
                                    var action = component.get('c.retrievePackageOffPremise');
                                if(fieldname=='CmrclPlanningBrandGroupNme__c')
                                    var action = component.get('c.retrievePackageOffPremisegroup');
                                if(fieldname=='TrademarkBrandFamilyNme__c')
                                    var action = component.get('c.retrievePackageOffPremiseFamily');
                            } else {  
                                if(fieldname=='TrademarkBrandLongNme__c')
                                    var action = component.get('c.retrievePackage');
                                if(fieldname=='CmrclPlanningBrandGroupNme__c')
                                    var action = component.get('c.retrievePackagegroup');
                                if(fieldname =='TrademarkBrandFamilyNme__c')
                                    var action = component.get('c.retrievePackageFamily');                                                                       
                            }
                            var a = action.setParams({brandName : brandName, selectedPkgId : selectedPkg});
                            action.setCallback(this,function(response){
                                if(response.getState() == "SUCCESS"){
                                    if (response.getReturnValue().length > 0){
                                        var results = response.getReturnValue().map(function(property) {
                                            return JSON.parse(property);
                                        });
                                        objective.set("v.packages", results);
                                    }
                                } else if (response.getState() === "ERROR"){
                                    var errors = data.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                            errors[0].message);
                                        }
                                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                        } else {
                                            component.set("v.showToastObjective", true);
                                            component.set("v.toastTitle", $A.get("$Label.c.Error"));
                                            component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                                            component.set("v.toastType", 'slds-theme_error');
                                        }
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                            $A.enqueueAction(action);
                        }
                    }
                }, this);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    component.set("v.showToastObjective", true);
                    component.set("v.toastTitle", $A.get("$Label.c.Error"));
                    component.set("v.toastMsg", $A.get("$Label.c.Internet_Connection_Error_Msg"));
                    component.set("v.toastType", 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper to update the objectives
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    updateAllRecords : function(component, event, helper){
        this.updateRecord(component, event, helper, 'v.objectives');
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   updates the objective list
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    updateRecord: function (component, event, helper, name) {
        try{
            if(navigator.onLine){
                var objectives = component.get(name);
                objectives.forEach(function (objective) {
                    objective['sobjectType'] = 'Objective__c';
                   // alert('inside'+objective.RecordType.Name);
                   if(objective.RecordType.Name =='Engagement' && objective.Date__c){ 
                      // alert('inside the update record');
                     //  alert('date'+objective.Date__c);
                      var dt = new Date(objective.Date__c);
                     //  alert('objective.currenttime'+objective.Currenttime);
                       if(objective.Currenttime != null){
                          dt.setHours(objective.Currenttime.split(':')[0]);
                     //  alert(objective.Currenttime.split(':')[1].replace(' AM','').replace(' PM',''));
                       //alert(objective.Currenttime.split(':')[1].split(' AM').split(' PM'));
                       dt.setMinutes(objective.Currenttime.split(':')[1].replace(' AM','').replace(' PM',''))
                       //alert(objective.currenttime);  
                       }
                      
                       objective['Date__c'] = dt;
                   } else if (objective.RecordType.Name == 'Placement' && objective.Product_Quantity__c){
                       var str= objective.Product_Quantity__c;
                    	// alert('objective'+objective.RecordType.Name);
                    	objective['Product_Quantity__c']= str.toString(); 
                   }
                }, this);
                var action = component.get("c.updateObjectives");
                //alert('inside updt');
                //alert('objective'+JSON.stringify(objective));
                action.setParams({ "objective": objectives });
                action.setCallback(this, function (response) {
                    if (response.getState() === "ERROR") {
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("Label.c.Call_Log_Objective_Save_Error"), 'error');
                            } else {
                                component.set("v.showToastObjective", true);
                                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                                component.set("v.toastMsg", $A.get("$Label.c.Call_Log_Objective_Save_Error"));
                                component.set("v.toastType", 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    component.set("v.showToastObjective", true);
                    component.set("v.toastTitle", $A.get("$Label.c.Error"));
                    component.set("v.toastMsg", $A.get("$Label.c.Internet_Connection_Error_Msg"));
                    component.set("v.toastType", 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   displays toast on desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
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
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   on status change the placement date is set 7 days ahead of today
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    statusChange : function(component, event, helper) {
        try{
            if(navigator.onLine){
                
                var placementIndex = event.currentTarget.dataset.record;
                var listOfObjectives = component.get("v.objectives");
                var placementRecord = listOfObjectives[placementIndex];
               if(placementRecord.Status__c == "Declined") {
                    //placementRecord.Product_Quantity__c=0;
                    component.set("v.statusDeclined", true);
                   
                    
            	} else{
                component.set("v.statusDeclined", false);
                   
                    if(placementRecord.Product_Quantity__c == 0){
                       
                     var pQuantity = [].concat(component.find("auraQty"));
                    console.log(pQuantity);
                    pQuantity.forEach(function(placementDate){
                        placementDate.set("v.value",'1');
                    });
                    } 
                   
                   
            }
                if(placementRecord.Status__c == "Committed" && placementRecord.RecordType.Name =='Placement'){
                    var pDate = [].concat(component.find("placementdt"));
                    pDate.forEach(function(placementDate){
                        if(placementDate.get("v.id") == placementIndex){
                            var action = component.get("c.getTodayPlusSevenDays");
                            action.setCallback(this, function(response) {
                                if (response.getState() === "SUCCESS") {
                                    placementDate.set("v.value", response.getReturnValue());
                                } else if (response.getState() === "ERROR") {
                                    var errors = data.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                            errors[0].message);
                                        }
                                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                        } else {
                                            component.set("v.showToastObjective", true);
                                            component.set("v.toastTitle", $A.get("$Label.c.Error"));
                                            component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                                            component.set("v.toastType", 'slds-theme_error');
                                        }
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                            $A.enqueueAction(action);
                        }
                    });
                }
                    //sets date picker on change of the status of dispaly objectives to 7 days for MC-1761
                if(placementRecord.Status__c == "Committed" && placementRecord.RecordType.Name =='Display'){
                    var dDate = [].concat(component.find("displaydt"));
                    dDate.forEach(function(displayDate){
                        if(displayDate.get("v.id") == placementIndex){
                            var action = component.get("c.getTodayPlusSevenDays");
                            action.setCallback(this, function(response) {
                                if (response.getState() === "SUCCESS") {
                                    displayDate.set("v.value", response.getReturnValue());
                                } else if (response.getState() === "ERROR") {
                                    var errors = data.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                            errors[0].message);
                                        }
                                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                        } else {
                                            component.set("v.showToastObjective", true);
                                            component.set("v.toastTitle", $A.get("$Label.c.Error"));
                                            component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                                            component.set("v.toastType", 'slds-theme_error');
                                        }
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                            $A.enqueueAction(action);
                        }
                    });
                }
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    component.set("v.showToastObjective", true);
                    component.set("v.toastTitle", $A.get("$Label.c.Error"));
                    component.set("v.toastMsg", $A.get("$Label.c.Internet_Connection_Error_Msg"));
                    component.set("v.toastType", 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   returns the declined values
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setDeclinedValues: function(component){
        try{
            if(navigator.onLine){
                var getDeclinedValAction = component.get("c.getDeclinedReasonPicklistValues");
                var valPromise = this.executePromiseAction(component, getDeclinedValAction);
                valPromise.then(
                    $A.getCallback(function(result){
                        component.set('v.declinedVals', result);
                    }),
                    $A.getCallback(function(error){
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    })
                );
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    component.set("v.showToastObjective", true);
                    component.set("v.toastTitle", $A.get("$Label.c.Error"));
                    component.set("v.toastMsg", $A.get("$Label.c.Internet_Connection_Error_Msg"));
                    component.set("v.toastType", 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   executes promise action to set declined values
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    executePromiseAction: function(component, action, callback){
        try{
            if(navigator.onLine){
                return new Promise(function(resolve, reject){
                    action.setCallback(this, function(response){
                        var state = response.getState();
                        if(state === 'SUCCESS'){
                            var retVal = response.getReturnValue();
                            resolve(retVal);
                        } else if(state === 'ERROR'){
                            var errors = response.getError();
                            if(errors && errors.length > 0){
                                if(errors[0] && errors[0].message){
                                    reject(Error('Error Message: ' + errors[0].message));
                                }
                            } else {
                                reject(Error("Unknown Error"));
                            }
                        }
                    });
                    $A.enqueueAction(action);
                });
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    component.set("v.showToastObjective", true);
                    component.set("v.toastTitle", $A.get("$Label.c.Error"));
                    component.set("v.toastMsg", $A.get("$Label.c.Internet_Connection_Error_Msg"));
                    component.set("v.toastType", 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets the declined value for the changed objective record
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setDeclinedValue: function(component, event, helper){
        try{
            var objIndex = event.currentTarget.dataset.record;
            var listOfObjectives = component.get("v.objectives");
            var values = component.find('declineOptions');
            var validatedObjectives = [];
            var options = [].concat(values);
            options.forEach(function(val) {
                if(typeof val != 'undefined'){
                    validatedObjectives.push(val);
                }
            }, this);
            var selOption = validatedObjectives[objIndex].get('v.value');
            listOfObjectives[objIndex].Declined_Reason__c = selOption;
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets the engagement type for the changed objective record
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    toggleEngagementType: function(component, event, helper){
        try{
            var listOfObjectives = component.get("v.objectives");
            var label = event.getSource().get('v.label');
            var index = parseInt(event.getSource().get('v.name').replace('engagementType', ''));
           
            if(label == $A.get("$Label.c.Objectives_Sampling")){
                listOfObjectives[index].Consumer_or_Waitstaff__c = 'Sampling';
            }
            else if(label == $A.get("$Label.c.Objectives_Consumer")){
                listOfObjectives[index].Consumer_or_Waitstaff__c = 'Consumer';
            } else if(label == $A.get("$Label.c.Objectives_Waitstaff")){
                listOfObjectives[index].Consumer_or_Waitstaff__c = 'Waitstaff';
            }             
            component.set("v.objectives[index].Consumer_or_Waitstaff__c", listOfObjectives[index].Consumer_or_Waitstaff__c);
           
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   gets the objective record that is being copied and fires an event to pass the information to the call log component.

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/30/2017    Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    copyObjectiveRecord: function(component, recordType, objectiveId){
        try{
            var objectiveList = component.get("v.objectives");
            var objectiveRecord = '';
            for (var i = 0; i < objectiveList.length; i++){
                if(objectiveList[i].Id == objectiveId){
                    objectiveRecord = objectiveList[i];
                }
            }
            var setEvent = component.getEvent("copyRecord");
            setEvent.setParams({"objective": objectiveRecord});
            setEvent.setParams({"recordType": recordType});
            setEvent.fire();
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
            
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   Sets Executed_By__c field based on Executed By radio selection

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/3/2018     Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    toggleExecutedBy: function(component, event, helper){
        try{
            var listOfObjectives = component.get("v.objectives");
            var label = event.getSource().get('v.label');
            var index = parseInt(event.getSource().get('v.name').replace('executedBy', ''));
            if(label == 'Individual'){
                listOfObjectives[index].Executed_By__c = 'Individual';
            } else if(label == 'Agency'){
                listOfObjectives[index].Executed_By__c = 'Agency';
            } else if(label == 'Both'){
                listOfObjectives[index].Executed_By__c = 'Both';
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   Checks for an executed status and sets the Executed_By__c field to the default value

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/3/2018     Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    checkStatusChange: function(component, event, helper){
        try{
            var listOfObjectives = component.get("v.objectives");
            var status = event.getSource().get('v.value');
            var index = parseInt(event.getSource().get('v.class').replace('engStatus', ''));
            if(status == 'Executed'){
                listOfObjectives[index].Executed_By__c = 'Individual';
            } else {
                listOfObjectives[index].Executed_By__c = '';
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                component.set("v.showToastObjective", true);
                component.set("v.toastTitle", $A.get("$Label.c.Error"));
                component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                component.set("v.toastType", 'slds-theme_error');
            }
        }
    }
})