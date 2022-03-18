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
    closeNewEngagementModal: function (component, event, helper) {
        var emptyArray = [];
        component.set("v.newObjective", {'sobjectType': 'Objective__c'});
        component.set("v.plannedObjectiveId", "");
        // MC:1701- Subtypes should be added on objectives instead of planned objectives
        component.set("v.subType","");
        component.set("v.subTypeValues", emptyArray);
        component.set("v.selectedSubType", "");
        component.set("v.showNewEngagement", false);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   clsoes objective page on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewEngagementModalMobile: function (component, event, helper) {
        var emptyArray = [];
        component.set("v.plannedObjectiveId", "");
        component.set("v.subTypeValues", emptyArray);
        component.set("v.selectedSubType", "");
        component.set("v.showNewEngagementAIF", false);
        component.set("v.showObjView", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets the engagement type for the objective
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    toggleEngagementType : function(component, event, helper){
        helper.toggleEngagementType(component, event, helper, null);
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
    Description:   Handles event Executed By radio buttons are changed

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/3/2018     Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    toggleExecutedBy : function(component, event, helper){
        helper.toggleExecutedBy(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   Checks if status is changed to executed

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/3/2018     Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    checkStatusChange : function(component,event,helper){
        helper.checkStatusChange(component, event, helper);
    },
     /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   sets the planned objectie record when the objective is copied
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/3/2018    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
    setPlannedObjective: function(component, event, helper){
        var objective = component.get("v.newObjective");
         //alert('date'+objective.Date__c);
         var today = new Date(objective.Date__c);
        var curdat = new Date();
       // alert('curdat'+curdat);
        if((today.getHours()!=curdat.getHours())&&(today.getMinutes()!=curdat.getMinutes())){
        var time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    	component.find('timepick').set('v.value',time); 
        }
        if(objective.Consumer_or_Waitstaff__c != null && objective.Consumer_or_Waitstaff__c != ''){
            helper.toggleEngagementType(component, event, helper, objective.Consumer_or_Waitstaff__c);
        }
        //MC:1786- Call log - Add Engagement - Changing status clears out selected MBOo
        if(!$A.util.isEmpty(objective.Planned_Objective__c)){
            component.set("v.plannedObjectiveId", objective.Planned_Objective__c);
        }
    },
    init : function(component, event, helper) {
      var today = new Date();
      component.find('dtEgage').set('v.value',today);
      var time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
   component.find('timepick').set('v.value',time); 
    }
})