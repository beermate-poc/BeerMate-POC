({
	   /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   creates new objective record
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    createSampling: function (component, event) {
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                var brandValue = component.find("brandSearch").get("v.searchValue");
                var subjects = [];
                var dates = [];
                var brands = [];
                var newObjective = component.get("v.newObjective");
                var action = component.get("c.saveObjective");
                var accountId = component.get("v.accountId");
                var callLogId = component.get("v.callLogId");
              //  var section = [].concat(component.find("addToDoSection").find("addToDoRow"));
                if(component.find('subTypeSelect') != null){
                    newObjective.Sub_Type_Selection__c = component.find('subTypeSelect').get("v.value");
                    // MC:1701- Subtypes should be added on objectives instead of planned objectives
                    newObjective.Sub_Type__c=component.get('v.subType');
                }
                if(component.find('amount') != null){
                   newObjective.Sampling_Dollar__c=component.find('amount').get('v.value');
                }
              /*  section.forEach(function (todo) {
                    if (todo != null) {
                        if ((todo.find("subject").get("v.value") != null) && (todo.find("subject").get("v.value") != '')) {
                            subjects.push(todo.find("subject").get("v.value"));
                        } if ((todo.find("datepicker").get("v.value") != null) && (todo.find("datepicker").get("v.value") != '')) {
                            dates.push(todo.find("datepicker").get("v.value"));
                        }
                    }
                }, this);*/
                action.setParams({
                    "newObjective": newObjective,
                    "subjects": subjects,
                    "activityDates": dates,
                    "brands": brandValue,
                    "accountId": accountId,
                    "callLogId": callLogId,
                    "rt": "Sampling",
                    "plannedParent" : component.find("plannedObjective").find("plannedSelect").get("v.value")
                });
                action.setCallback(this, function (response) {
                    if (response.getState() === "SUCCESS") {
                        component.set("v.disableSaveButton", true);
                        $A.util.addClass(spinner, "slds-hide");
                        if($A.get("$Browser.formFactor") == "DESKTOP"){
                            this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Sampling") + ' ' + $A.get("$Label.c.Record_Created"), 'success' );
                        }
                        this.navigateToCallLog(component, event);
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                            errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
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
                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   runs validity check for the input fields
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    inputValidityCheck: function (component, value) {
        try{
            if (typeof value != 'undefined' && !value.get('v.validity').valid) {
                var missingValue = value.get('v.messageWhenValueMissing');
                var message = missingValue && value.get('v.validity').valueMissing ? missingValue : $A.get("$Label.c.Call_Log_Engagement_Name_Error");
                if($A.get("$Browser.formFactor") == "DESKTOP"){
                    this.displayToast($A.get("$Label.c.Warning"), message, 'warning');
                } else {
                    this.displayToastMobile(component, $A.get("$Label.c.Warning"), message, 'slds-theme_warning');
                }
                return false;
            }
            return true;
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   validates input fields on the page
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    validatePage: function (component, event) {
        try{
            var errorsFound = false;
           var objective = component.get("v.newObjective");
            var status = component.find("statusSelectOptions").get("v.value");
            var brandSearch = component.find('brandSearch');
           // var egageDate = component.find('dt').get("v.value");
            var egageDateMaterials = component.find('dtEgage').get("v.value");
            var subjects = [];
            var dates = [];
            var status = component.find("statusSelectOptions").get("v.value");
           // alert('object1');
            if (objective) {
                this.inputValidityCheck(component, component.find("sampName")) ? null : errorsFound = true;
                this.inputValidityCheck(component, component.find("statusSelectOptions")) ? null : errorsFound = true;
              //  this.inputValidityCheck(component, brandSearch.find("theLookup")) ? null : errorsFound = true;
                if (!egageDateMaterials && (status == 'Committed' || status == 'Executed')) {
                    if($A.get("$Browser.formFactor") == "DESKTOP"){
                        this.displayToast($A.get("$Label.c.Warning"),  $A.get("$Label.c.Call_Log_Engagement_Date_Error"), 'warning');
                    } else {
                        this.displayToastMobile(component, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Date_Error"), 'slds-theme_warning');
                    }
                    errorsFound = true;
                    return;
                }
                if(component.find("subTypeSelect") != null){
                    if (!component.find('subTypeSelect').get("v.value")  && (status =='Executed' || status =='Committed')){
                        if($A.get("$Browser.formFactor") == "DESKTOP"){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Sub_Type_Error"), 'warning');
                        } else {
                            this.displayToastMobile(component, $A.get("$Label.c.Warning"), $A.get("$Label.c.Sub_Type_Error"), 'slds-theme_warning');
                        }
                        errorsFound = true;
                        return;
                    }
                }
               
            }
            if (!errorsFound) {
                this.createSampling(component, event);
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   displays toast on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration ) {
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
    Description:   displays toast on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    displayToastMobile: function(component, title, message, type){
        try{
            component.set("v.showErrorToast", true);
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showErrorToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   navigates to call log after the objective is created
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    navigateToCallLog : function(component, event){
        var emptyArray = [];
        if($A.get("$Browser.formFactor") == "DESKTOP"){
            component.set("v.showNewSampling", false);
            component.set("v.loadObjectives", true);
            component.set("v.newObjective", {'sobjectType': 'Objective__c'});
            component.set("v.plannedObjectiveId", "");
            // MC:1701- Subtypes should be added on objectives instead of planned objectives
            component.set("v.subType","");
            component.set("v.subTypeValues", emptyArray);
            component.set("v.selectedSubType", "");
            component.set("v.disableSaveButton", false);
        } else {
            component.set("v.plannedObjectiveId", "");
            component.set("v.subTypeValues", emptyArray);
            component.set("v.selectedSubType", "");
            // MC:1701- Subtypes should be added on objectives instead of planned objectives
            component.set("v.subType","");
            component.set("v.showNewSamplingAIF", false);
            component.set("v.showObjView", true);
            component.set("v.newRecord", $A.get("$Label.c.Engagement"));
            component.set("v.showToast", true);
        }
    } ,
    
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   Sets view values on form if planned objective select is changed

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/17/2017    Brian Mansfield       Initial Creation
    ------------------------------------------------------------*/
    setFormFieldsFromTemplate : function(component, template) {
        try{
            var emptyArray = [];
            if(template != null){
                component.find("sampName").set("v.value", template.Name);
              //  component.find("engageDetail").set("v.value", template.Description__c);
                component.find("brandSearch").set("v.searchValue", template.Brand_Name__c);
                if(template.Planned_Objective__c != null && template.Planned_Objective__c != ''){
                    if(template.Sub_Type__c != null && template.Sub_Type__c != ''){
                        if(template.Sub_Type__r.Sub_Type_Values__c != null && template.Sub_Type__r.Sub_Type_Values__c != ''){
                            var subTypes = template.Sub_Type__r.Sub_Type_Values__c.split(",").map(function(item) {
                                return item.trim();
                            });
                            component.set("v.subTypeValues", subTypes); 
                            // MC:1701- Subtypes should be added on objectives instead of planned objectives
                            component.set("v.subType",template.Sub_Type__c);
                        }
                    } else {
                        component.set("v.subTypeValues", emptyArray);
                        // MC:1701- Subtypes should be added on objectives instead of planned objectives
                        component.set("v.subType","");
                    }
                    component.set("v.plannedObjectiveId", template.Planned_Objective__c);
                }
            } else {
                component.set("v.selectedSubType", "");
                // MC:1701- Subtypes should be added on objectives instead of planned objectives
                component.set("v.subType","");
                component.set("v.subTypeValues", emptyArray);
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    }
})