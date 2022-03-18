({  
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   sets up the planned objective name if the objective record is being copied

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/30/2017    Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    init: function(component, event, helper){
        var mobile = component.get("v.mobile");
        var brandValue = component.find("brandSearch").get("v.searchValue");
        if(mobile && (brandValue != '' && brandValue != null)){
            helper.setMCProd(component);
        }
    },
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
    Description:   closes objective modal
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewFeatureModal: function (component, event, helper) {
        var emptyArray = [];
        component.set("v.newObjective", {'sobjectType': 'Objective__c'});
  // MC:1701- Subtypes should be added on objectives instead of planned objectives
        component.set("v.subType","");
        component.set("v.subTypeValues", emptyArray);
        component.set("v.selectedSubType", "");
        component.set("v.plannedObjectiveId", "");
        component.set("v.showNewFeature", false);
        component.set("v.mcProd", '');
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   clsoes objective page on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewFeatureModalMobile: function (component, event, helper) {
        var emptyArray = [];
        component.set("v.plannedObjectiveId", "");
        component.set("v.subTypeValues", emptyArray);
        component.set("v.selectedSubType", "");
        component.set("v.showNewFeatureAIF", false);
        component.set("v.showObjView", true);
        component.set("v.mcProd", '');
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
        var isOffPrem = component.get('v.featIsOffPremise');
        if (isOffPrem) {
            helper.setFormFieldsFromTemplateOffPremise(component, template);
        } else {
            helper.setFormFieldsFromTemplate(component, template);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets mc product when objective is copied
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setMCProd: function(component, event, helper){
        helper.setMCProd(component);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets planned objective when objective is copied
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setPlannedObjective: function(component, event, helper){
        var objective = component.get("v.newObjective");
        // MC:1784: Call Log - Add Feature - MBO disappears when you fill in other fields
        if(!$A.util.isEmpty(objective.Planned_Objective__c)){       
            component.set("v.plannedObjectiveId", objective.Planned_Objective__c);
        }
    }
})