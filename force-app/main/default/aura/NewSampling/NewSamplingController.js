({
	    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper to validate the input fields
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    createNewObjective: function (component, event, helper) {
        helper.validatePage(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   closes modal on desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewSamplingModal: function (component, event, helper) {
        var emptyArray = [];
        component.set("v.newObjective", {'sobjectType': 'Objective__c'});
        component.set("v.plannedObjectiveId", "");
        // MC:1701- Subtypes should be added on objectives instead of planned objectives
        component.set("v.subType","");
        component.set("v.subTypeValues", emptyArray);
        component.set("v.selectedSubType", "");
        component.set("v.showNewSampling", false);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   clsoes objective page on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewSamplingModalMobile: function (component, event, helper) {
        var emptyArray = [];
        component.set("v.plannedObjectiveId", "");
        component.set("v.subTypeValues", emptyArray);
        component.set("v.selectedSubType", "");
        component.set("v.showNewSamplingAIF", false);
        component.set("v.showObjView", true);
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   Handles event if planned objective select is changed

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/17/2017    Brian Mansfield       Initial Creation
    ------------------------------------------------------------*/
    plannedObjectiveChanged : function(component, event, helper) {
        var template = event.getParam("template");
        helper.setFormFieldsFromTemplate(component, template);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   Checks for an executed status and sets the Executed_By__c field to the default value

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/3/2018     Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    checkStatusChange : function(component, event, helper){
        var status = component.find("statusSelectOptions").get("v.value");
        var newObjective = component.get("v.newObjective");
        if(status == 'Executed'){
            newObjective.Executed_By__c = 'Individual';
        } else {
            newObjective.Executed_By__c = '';
        }
    },
    init : function(component, event, helper) {
    var today = new Date();
    var time = today.getTime();
    var h = today.getHours();
  	var m = today.getMinutes();
    component.set('v.curTime',h+':'+m);
     var getDate = component.get("v.newObjective.Date__c");
        if (!getDate){
            component.set("v.newObjective.Date__c",today);
        }
        }
})