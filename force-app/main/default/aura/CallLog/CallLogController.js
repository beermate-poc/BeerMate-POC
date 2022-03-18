/*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
5/12/2017    Bryant Daniels     Initial Creation
10/16/2017   Dan Zebrowski      Update to remove navigateToComponent
11/1/2017    Nick Serafin       Updated functionality to work without navigateToComponent
------------------------------------------------------------*/
({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls the helper to set where to hunt flag and the intial objective lists

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added getMeetingSummary apex method call
    11/1/2017   Nick Serafin         added check for desktop and whether to show call log or recent call log summary list
    ------------------------------------------------------------*/
    init: function (component, event, helper) {
        try{
            helper.getCurrentUserRole(component,event,helper);
            var desktopCall = component.get("v.desktopCall");
            if($A.get("$Browser.formFactor") == 'DESKTOP' && desktopCall){
                component.set("v.showObjView", true); 
                component.set("v.showCallLog", true);
                helper.getAccountInformation(helper, component, event, component.get("v.recordId"));
                helper.startCall(component, event, helper);
            } else {
                helper.getAccountInformation(helper, component, event, component.get("v.recordId"));                
                component.set("v.showObjView", true);
                component.set("v.showCallLog", true);               	
                if($A.get("$Browser.formFactor") != 'DESKTOP'){
                     var action = component.get("c.startACall");
                action.setParams({ accountId : component.get("v.recordId") });
                action.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var callLog = data.getReturnValue();
                        component.set("v.callLogId", callLog.Id);
                    }
                 });
                $A.enqueueAction(action);
               helper.getCurrentOwner(helper, component, event, component.get("v.recordId"));
               helper.getCallLog(helper, component, event, component.get("v.callLogId"), component.get("v.recordId")); 
                }
                 if($A.get("$Browser.formFactor") == 'DESKTOP'){
                helper.callLogSummary(component, event,component.get("v.showSaveButton"));
                }
                var s = document.createElement('style');
                s.innerHTML = "html,html body{overflow:auto;-webkit-overflow-scrolling:touch;}body{position:absolute;left:0;right:0;top:0;bottom:0;}";
                document.getElementsByTagName('head')[0].appendChild(s);
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   Formats the scheduled meeting date

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    ------------------------------------------------------------*/
    setFormat: function (component, event, helper) {
        try{
            var normalDate = component.find("hDate");
            var smallDate = component.find("hDatem");
            if(normalDate){
                var theDate = component.find("hDate").get("v.value");
                var formateDate = $A.localizationService.formatDate(theDate);
                component.set("v.formattedDate", formateDate);
            } else if(smallDate){
                var theDate = component.find("hDatem").get("v.value");
                var formateDate = $A.localizationService.formatDate(theDate);
                component.set("v.formattedDate", formateDate);
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows contact modal to set meeting with contact

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017    Bryant Daniels       Inital Creation
    11/1/2017    Nick Serafin         added logic for dekstop vs mobile
    ------------------------------------------------------------*/
    changeContact: function (component, event, helper) {
        if($A.get("$Browser.formFactor") == 'DESKTOP'){
            component.set('v.showContact', true);
            helper.updateObjectives(component, event, helper);
        } else {
            component.set('v.showContact', true);
            component.set("v.showObjView", false);
            helper.updateObjectives(component, event, helper);
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   hides contact modal

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017    Nick Serafin         Inital Creation
    ------------------------------------------------------------*/
    closeChangeContact: function (component, event) {
        component.set('v.showContact', false);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows feature modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newFeature: function (component, event, helper) {
        component.set('v.showNewFeature', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows engagement modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newEngagement: function (component, event, helper) {
        component.set('v.showNewEngagement', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows placement modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newPlacement: function (component, event, helper) {
        component.set('v.showNewPlacement', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows space modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newSpace: function (component, event, helper) {
        component.set('v.showNewSpace', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
        /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows space modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newSampling: function (component, event, helper) {
        component.set('v.showNewSampling', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows merchandise modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newMerchandise: function (component, event, helper) {
        component.set('v.showNewMerchandise', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows display modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newDisplay: function (component, event, helper) {
        component.set('v.showNewDisplay', true);
        helper.updateObjectives(component, event, helper);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows todo modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newToDo: function (component, event, helper) {
        component.set('v.showNewToDo', true);
        helper.updateObjectives(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows note modal and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    11/1/2017   Nick Serafin         added call to toggleObjectiveDropdown() helper method
    ------------------------------------------------------------*/
    newNote: function (component, event, helper) {
        component.set('v.showNewNote', true);
        helper.updateObjectives(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   saves and end the call log

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    8/16/2017   Alec Klein           added call to recordCallLogGeolocation() heler method
    ------------------------------------------------------------*/
    saveEndCallLog: function (component, event, helper){
        helper.validatePage(component, event, helper);
        //helper.recordCallLogGeolocation(component, helper, 'end');
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows feature objective mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewFeatureM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set("v.showNewFeatureAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows engagement objective mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewEngagementM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set("v.showNewEngagementAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows placement objective mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewPlacementM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set("v.showNewPlacementAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows space objective mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewSpaceM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set('v.showMore', false);
        component.set("v.showNewSpaceAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows merchandise objective mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewMerchandiseM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set('v.showMore', false);
        component.set("v.showNewMerchandiseAIF", true);
    },
    
       navigateToNewSamplingM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set('v.showMore', false);
        component.set("v.showNewSamplingAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows display objective mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show objective screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewDisplayM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set("v.showNewDisplayAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows toDo mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show toDo screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewToDoM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set('v.showMore', false);
        component.set("v.showNewToDoAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   shows note mobile screen and saves any changes made to the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/12/2017   Bryant Daniels       Inital Creation
    10/16/2017  Dan Zebrowski        added logic to show note screen with boolean flag
    ------------------------------------------------------------*/
    navigateToNewNoteM: function (component, event, helper) {
        helper.updateObjectives(component, event, helper);
        component.set("v.showObjView", false);
        component.set('v.showMore', false);
        component.set("v.showNewNoteAIF", true);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   navigates the user to the account detail page

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/22/2017   Nick Serafin      Inital Creation
    11/1/2017   Nick Serafin      added logic to handle desktop and mobile navigation to the account
    ------------------------------------------------------------*/
    navigateToAccount: function (component, event, helper) {
        helper.updateObjectives(component,event);
        if($A.get("$Browser.formFactor") == 'DESKTOP'){
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": component.get("v.recordId"),
                "slideDevName": "detail",
                "isredirect": false
            });
            navEvt.fire();
        } else {
            var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the updateAccessBuildingWithBeer() apex method

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Nick Serafin      Inital Creation
    ------------------------------------------------------------*/
    bwbClicked: function (component, event, helper){
        try{
            if(navigator.onLine){
                var action = component.get("c.updateAccessBuildingWithBeer");
                action.setParams({ callLogId: component.get("v.callLogId")});
                action.setCallback(this, function (data) {
                    if (data.getState() === "ERROR") {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'info');
                            } else {
                                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_info');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_error');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   saves the next meeting info

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Nick Serafin      Inital Creation
    ------------------------------------------------------------*/
    saveMeetingInfo : function(component, event, helper){
        helper.saveMeetingInfo(component, event);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   toggles the objective menu dropdown to close or open

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Bryant Daniels     Inital Creation
    ------------------------------------------------------------*/
    handleObjectiveMenuClick : function(component, event, helper) {
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   opens the objective modal for the selected objective record and passes the objective information to be copied

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/30/2017    Nick Serafin       Initial Creation
    11/1/2017    Nick Serafin       Updated how the objective info is passed since we are defining the objective components
                                    in the markup instead of dynamically creating them
    4/25/2018    Larry Cardenas     Updated logic to pull in Sub Types from the Objectives object MC-1707   
    18/12/2019   Shruti Garg         Updated logic to pull in No of consumers and Sampoing Dollar from the Objective as Engagement Type  GB-7530   
    ------------------------------------------------------------*/
    copyRecord : function(component, event, helper){
        try{
            helper.updateObjectives(component,event);
            var objective = event.getParam("objective");
            var recordType = event.getParam("recordType");
            var recordId = component.get('v.recordId');
            var offPrem = component.get('v.isOffPrem');
            var android = $A.get("$Browser.isAndroid");
            var ios = $A.get("$Browser.isIOS");
            var subTypes = [];
            var subType = '';
            var noOfConsumers = '';
            var samplingDollar = '';
            if(objective != null && objective != ''){
                if(typeof objective.Planned_Objective__c != 'undefined' && objective.Planned_Objective__c != null && objective.Planned_Objective__c != ''){
                if(objective.Sub_Type__c != null && objective.Sub_Type__c != ''){
                        if(objective.Sub_Type__r.Sub_Type_Values__c != null && objective.Sub_Type__r.Sub_Type_Values__c != ''){
                            subTypes = objective.Sub_Type__r.Sub_Type_Values__c.split(',');
                        }
                    }
                }
                if(objective.Sub_Type_Selection__c != null && objective.Sub_Type_Selection__c != ''){
                    subType = objective.Sub_Type_Selection__c;
                }
               
               
                var objectiveRecordToInsert = {'sobjectType': 'Objective__c', 
                                               'Name': $A.get("$Label.c.Call_Log_Copy_Name_Label") + ' ' + objective.Name, 
                                               'Status__c': 'Not Started', 
                                               'Brands__c': objective.Brands__c, 
                                               'Description__c': objective.Description__c,
                                               'Consumer_Engagement_Type__c': objective.Consumer_Engagement_Type__c, 
                                               'Waitstaff_Engagement_Type__c': objective.Waitstaff_Engagement_Type__c,
                                               'Draft_Package__c': objective.Draft_Package__c, 
                                               'Can_Package__c': objective.Can_Package__c, 
                                               'Bottle_Package__c': objective.Bottle_Package__c,
                                               'Aluminium_Pint_Package__c': objective.Aluminium_Pint_Package__c,
                                               'Planned_Objective__c': objective.Planned_Objective__c, 
                                               'MC_Product__c': objective.MC_Product__c ,
                                               'Consumer_or_Waitstaff__c' : objective.Consumer_or_Waitstaff__c,
                                               'Sampling_Dollar__c':objective.Sampling_Dollar__c,
                                               'Date__c':objective.Date__c,
                                               'End_Time__c':objective.End_Time__c,
                                               'Start_Time__c':objective.Start_Time__c,
                                               'Number_of_Consumers_Sampled__c':objective.Number_of_Consumers_Sampled__c,
                                               'Sampling__c':objective.Sampling__c,
                                               'Number_of_People_Engaged__c':objective.Number_of_People_Engaged__c};
                if(recordType == 'Engagement'){
                    if(android || ios){
                        component.set("v.showNewEngagementAIF", true);
                        component.set("v.engagementCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                       //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        component.set("v.showObjView", false);
                        //component.set("v.engagementType", objective.Consumer_or_Waitstaff__c);
                    } else {
                        component.set('v.showNewEngagement', true);
                        component.set("v.engagementCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                       //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        // component.set("v.engagementType", objective.Consumer_or_Waitstaff__c);
                        window.scroll(0, 0);
                    }
                } else if(recordType == 'Feature'){
                    if(android || ios){
                        component.set("v.showNewFeatureAIF", true);
                        component.set("v.featureCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                        //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        component.set("v.showObjView", false);
                        if(offPrem){
                            component.set("v.mcProd", objectiveRecordToInsert.MC_Product__c);
                        }
                    } else {
                        component.set('v.showNewFeature', true);
                        component.set("v.featureCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                        //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        if(offPrem){
                            component.set("v.mcProd", objectiveRecordToInsert.MC_Product__c);
                        }
                        window.scroll(0, 0);
                    }
                }
                else if(recordType == 'Merchandise'){
                    if(android || ios){
                        component.set("v.showNewMerchandiseAIF", true);
                        component.set("v.merchandiseCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                        //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        component.set("v.showObjView", false);
                        if(offPrem){
                            component.set("v.mcProd", objectiveRecordToInsert.MC_Product__c);
                        }
                    } else {
                        component.set('v.showNewMerchandise', true);
                        component.set("v.merchandiseCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                        //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        if(offPrem){
                            component.set("v.mcProd", objectiveRecordToInsert.MC_Product__c);
                        }
                        window.scroll(0, 0);
                    }
                }else if(recordType == 'Sampling'){
                    if(android || ios){
                        component.set("v.showNewSamplingAIF", true);
                        component.set("v.samplingCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                        //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        component.set("v.showObjView", false);
                        if(offPrem){
                            component.set("v.mcProd", objectiveRecordToInsert.MC_Product__c);
                        }
                    } else {
                        component.set('v.showNewSampling', true);
                        component.set("v.samplingCopy", objectiveRecordToInsert);
                        component.set("v.subTypeValues", subTypes);
                        //component.set("v.selectedSubType", subType);
                        component.set("v.subType",objective.Sub_Type__c);
                        if(offPrem){
                            component.set("v.mcProd", objectiveRecordToInsert.MC_Product__c);
                        }
                        window.scroll(0, 0);
                    }
                }

            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   opens the showMore section of objective icons for mobile

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Bryant Daniels     Inital Creation
    ------------------------------------------------------------*/
    showMore : function(component, event, helper){
        component.set('v.showMore', true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   hides the showMore section of objective icons for mobile

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Bryant Daniels     Inital Creation
    ------------------------------------------------------------*/
    cancelShowMore : function(component, event, helper){
        component.set('v.showMore', false);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   saves the meeting summary notes

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Bryant Daniels     Inital Creation
    ------------------------------------------------------------*/
    saveSummary : function(component, event, helper) {
        helper.saveSummary(component, event, true,  helper,component.find("summaryText").get("v.value"));
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   cancels the call and closes the call log component

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Bryant Daniels     Inital Creation
    ------------------------------------------------------------*/
    cancelCall: function (component, event, helper) {
        if($A.get("$Browser.formFactor") == 'DESKTOP'){
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": component.get("v.recordId"),
                "slideDevName": "detail",
                "isredirect": false
            });
            navEvt.fire();
        } else {
            var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   starts the call and loads the initial information for the call log

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    startCall: function (component, event, helper) {
        helper.startCall(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   stops the spinner after a loading action has taken place

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    stopSpinner: function (component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
        component.set("v.engagementCopy", {'sobjectType': 'Objective__c'});
        component.set("v.featureCopy", {'sobjectType': 'Objective__c'});
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   creates a toast on mobile when an error or success is found

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    createToast: function (component, event, helper){
        var toast = component.get("v.showToast");
        var toastObjective = component.get("v.showToastObjective");
        var toastTitle = component.get("v.toastTitle");
        var toastMsg = component.get("v.toastMsg");
        var toastType = component.get("v.toastType");
        var obj = component.get("v.newRecord");
        if(toast){
            helper.displayToastMobileCallLog(component, false, $A.get("$Label.c.Success"), obj + ' ' + $A.get("$Label.c.Call_Log_Objective_Created"), 'slds-theme_success');
        } else if(toastObjective){
            helper.displayToastMobileCallLog(component, true, toastTitle, toastMsg, toastType);
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   shows the spinner before a loading action occurs

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    showSpinner: function (component, event, helper){
        if(navigator.onLine){
            var spinner = component.find("spinner");
            var objView = component.get("v.showObjView");
            if($A.util.hasClass(spinner, "slds-hide") && objView){
                $A.util.removeClass(spinner, "slds-hide");
                $A.util.addClass(spinner, "slds-show");
            }
        } else {
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the loadObjectives method on the Objectives component to reload the objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    loadObjectives: function(component, event, helper){
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                var objectives = component.find("obj");
                var loadObjectives = component.get("v.loadObjectives");
                if($A.util.hasClass(spinner, "slds-hide") && loadObjectives){
                    $A.util.removeClass(spinner, "slds-hide");
                    $A.util.addClass(spinner, "slds-show");
                    objectives.loadObjectives();
                }
                component.set("v.loadObjectives", false);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the loadNotes method on the RecentNotes component to reload the notes

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    loadNotes: function(component, event, helper){
        try{
            var notes = component.find("note");
            var loadNotes = component.get("v.loadNotes");
            if(notes && loadNotes){
                notes.loadNotes();
            }
            component.set("v.loadNotes", false);
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the loadToDos method on the RecentToDos component to reload the todos

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/1/2017   Nick Serafin     Inital Creation
    ------------------------------------------------------------*/
    loadToDos: function(component, event, helper){
        try{
            var todos = component.find("todo");
            var loadToDos = component.get("v.loadToDos");
            if(todos && loadToDos){
                todos.loadToDos();
            }
            component.set("v.loadToDos", false);
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*saveCallSummary : function(component, event, helper){
         helper.recordCallLogGeolocation(component, helper, 'end');
        helper.saveSummary(component, event, true,  helper,component.find("userSummary").get("v.value"));
         var sObjectEvent = $A.get("e.force:navigateToSObject");
        sObjectEvent.setParams({
            "recordId": component.get("v.recordId"),
                "slideDevName": "detail",
                "isredirect": false
        })
        sObjectEvent.fire();
    }*/
})