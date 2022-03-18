({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets notes related to the current account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    init : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getRecentNotes");
                action.setParams({ accountId : component.get("v.accountId") });
                action.setCallback(this, function(data) {
                    if(data.getState() === "SUCCESS"){
                        var notes = data.getReturnValue();
                        component.set("v.recentNotes", notes);
                        component.set("v.lastIndexCurrentlyShown", 4);
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                    } else {
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                        $A.log("Errors", data.getError());
                    }
                });
                $A.enqueueAction(action);
            } else {
                var spinner = component.find('spinner');
                $A.util.addClass(spinner, 'slds-hide');
                console.error('No Internet Connection');
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   deletes selected note
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    deleteNote : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var recId = event.currentTarget.dataset.record;
                var action = component.get("c.deleteNoteServerSide");
                action.setParams({
                    "recId" : recId
                });
                action.setCallback(this, function(a) {
                    if (a.getState() === "SUCCESS") {
                    } 
                    else if (a.getState() === "ERROR") {
                        $A.log("Errors", a.getError());
                    }
                });
                $A.enqueueAction(action);
                helper.refreshNotes(component, event);
            } else {
                console.error('No Internet Connection');
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   opens edit modal for a selected note
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    edit : function(component, event, helper) {
        try{
            var c = component.find("editOverlay");
            var recId = event.currentTarget.dataset.record;
            component.set("v.showNotes", false);
            c.open(recId);
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets notes related to the current account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    refresh : function(component, event, helper) {
        helper.refreshNotes(component, event);
    }
})