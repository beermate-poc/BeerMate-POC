({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helepr to validate input fields
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
    closeNewMerchandiseModal: function (component, event, helper) {
        component.set("v.showNewMerchandise", false);
          // MC:1701- Subtypes should be added on objectives instead of planned objectives
        component.set("v.subType","");
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   closes modal on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewMerchandiseModalMobile: function (component, event, helper) {
       component.set("v.showNewMerchandiseAIF", false);
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
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   sets the planned objectie record when the objective is copied
    History
    <Date>        <Authors Name>       <Brief Description of Change>
    4/18/2018     Jacqueline Passehl    Initial Creation
    ------------------------------------------------------------*/
    setPlannedObjective: function(component, event, helper){
        var objective = component.get("v.newObjective");
        // MC-1854 :Copy Merchandise, Selecting MBO clears MBO field
        if(!$A.util.isEmpty(objective.Planned_Objective__c)){       
            component.set("v.plannedObjectiveId", objective.Planned_Objective__c);
        }
    }

})