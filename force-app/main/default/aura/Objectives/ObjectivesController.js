({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   loads initial objective records related to the account and call log
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    init: function (component, event, helper) {
        helper.loadPage(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   updates the objective list
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    updateRecord: function (component, event, helper) {
        helper.updateAllRecords(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets the date 7 days ahead of today
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setDate: function (component, event) {
        var newDate = new Date().addDays(7);
        var formateDate = $A.localizationService.formatDate(newDate);
        component.set("v.formattedDate", formateDate);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper method on change of status
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    statusChange : function(component, event, helper) {
        helper.statusChange(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper to set declined value
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    setDeclinedVal : function(component, event, helper){
        helper.setDeclinedValue(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper to set the engagement type
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    toggleEngagementType : function(component, event, helper){
        helper.toggleEngagementType(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   gets the objective id and record type for the objective that is selected to be copied.

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/30/2017    Nick Serafin       Initial Creation
    ------------------------------------------------------------*/
    copyObjective : function(component, event, helper){
        try{
            var objectiveId = event.currentTarget.dataset.record;
            var recordType = '';
            if(objectiveId.indexOf('engagement') > -1 && objectiveId != null){
                objectiveId = objectiveId.substring(0, objectiveId.length - 10);
                recordType = 'Engagement';
            } else if(objectiveId.indexOf('feature') > -1 && objectiveId != null){
                objectiveId = objectiveId.substring(0, objectiveId.length - 7);
                recordType = 'Feature';
            }
            else if(objectiveId.indexOf('merchandise') > -1 && objectiveId != null){
                objectiveId = objectiveId.substring(0, objectiveId.length - 11);
                recordType = 'Merchandise';
            }else if(objectiveId.indexOf('Sampling') > -1 && objectiveId != null){
                objectiveId = objectiveId.substring(0, objectiveId.length - 8);
                recordType = 'Sampling';
            }
            helper.copyObjectiveRecord(component, recordType, objectiveId);
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
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
    checkStatusChange : function(component, event, helper){
        helper.checkStatusChange(component, event, helper);
    }
})