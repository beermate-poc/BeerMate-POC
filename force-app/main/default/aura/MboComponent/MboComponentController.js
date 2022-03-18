({
    doInit : function(component) {
        try{
            var action = component.get("c.queryOptions");
            action.setParams({"type": component.get("v.objectiveType")});
            action.setCallback(this, function(a) {
                var state = a.getState();
                if (state === "SUCCESS") {
                    component.set("v.plannedObjectives", a.getReturnValue());
                } else {
                    var errors = a.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.error("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   Initializes event shape, retrieves template SObject for event parameter, and fires event

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/17/2017    Brian Mansfield       Initial Creation
    ------------------------------------------------------------*/
    selectChanged : function(component, event, helper) {
        try{
            var compEvent = component.getEvent("plannedObjChanged");
            var action = component.get("c.queryTemplate");
            action.setParams({
                "type": component.get("v.objectiveType"),
                "plannedObjectiveId": component.find("plannedSelect").get("v.value")
            });
            action.setCallback(this, function(a) {
                var state = a.getState();
                console.log(a.getReturnValue());
                if (state === "SUCCESS") {
                    if(a.getReturnValue() != null){
                        compEvent.setParams({"template" : a.getReturnValue()}); 
                        compEvent.fire();
                    } else {
                        compEvent.setParams({"template" : null}); 
                        compEvent.fire();
                    }
                } else {
                    var errors = a.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.error("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        } catch(e){
            console.error(e);
        }
    }
})