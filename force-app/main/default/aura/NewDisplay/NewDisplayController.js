({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper to validate input fields
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
    Description:   closes display modal on desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewDisplayModal: function (component, event, helper) {
                // MC:1701- Subtypes should be added on objectives instead of planned objectives
        component.set("v.subType","");
        component.set("v.showNewDisplay", false);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   closes display page on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    closeNewDisplayModalMobile: function (component, event, helper) {
        component.set("v.showNewDisplayAIF", false);
        component.set("v.showObjView", true);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   clears input fields
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    clearInput : function (component, event, helper) {
        try{
            if ((event.getParam("oldValue") == 'Committed' || event.getParam("oldValue") == 'Executed') &&  
                (event.getParam("value") != 'Committed' || event.getParam("value") != 'Executed')) {
                component.set("v.newObjective.Notes_for_Distributor__c", '');
                component.set("v.newObjective.Supporting_Materials_Delivery_Date__c", '');
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
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
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   sets date picker on change of the status of dispaly objectives to 7 days for MC-1761
    ------------------------------------------------------------*/
    statusChange : function(component, event, helper) {
        try{
            
            if (component.find("statusSelectOptions").get("v.value") == "Committed") {
                if(navigator.onLine){
                    var action = component.get("c.getTodayPlusSevenDays");
                    action.setCallback(this, function(response) {
                        if (response.getState() === "SUCCESS") {
                            component.find("dt").set("v.value", response.getReturnValue());
                        } else if (response.getState() === "ERROR") {
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.error("Error message: " + 
                                                  errors[0].message);
                                }
                                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                } else {
                                    helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                }
                            } else {
                                console.error("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                } else {
                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                        helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                    } else {
                        helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                    }
                }
            }
        } catch(e) {
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    }
})