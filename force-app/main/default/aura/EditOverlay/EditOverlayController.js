({
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   hides the spinner
    <Date>      <Authors Name>     <Brief Description of Change>
    5/07/2017     Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    init : function(component, event, helper) {
        if(navigator.onLine){
            var spinner = component.find("spinner");
            $A.util.addClass(spinner, "slds-hide");
        } else {
            console.error('No Internet Connection');
        }
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   shows the edit panel and displays the note information
    <Date>      <Authors Name>     <Brief Description of Change>
    5/07/2017     Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    showPanel : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var overlay = component.find("overlay");
                $A.util.removeClass(overlay, "slds-hide");
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                var e = event.getParam('arguments').recId;
                component.set("v.id", e);
                var action = component.get("c.getNote");
                action.setParams({ recId : component.get("v.id") });
                action.setCallback(this, function(data) {
                    if(data.getState() === "SUCCESS"){
                        var note = data.getReturnValue();
                        var bodyNote = note[1];
                        component.find("subject").set("v.value", note[0]);
                        // need to set the content to an attribute, and then force the rerender to fire, can't bind it directly to a rich text
                        component.find("body").set("v.value",bodyNote);
                        $A.util.addClass(spinner, 'slds-hide');
                    } else {
                        $A.log("Errors", data.getError());
                    }
                });
                $A.enqueueAction(action);
            } else {
                console.error('No Internet Connection');
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   hides the edit panel
    <Date>      <Authors Name>     <Brief Description of Change>
    5/07/2017     Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    hidePanel : function(component, event, helper) {
        var overlay = component.find("overlay");
        $A.util.addClass(overlay, "slds-hide");
        component.find("subject").set("v.value", "");
        component.find("body").set("v.value", "");
        component.set("v.showNotes", true);
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   saves updates made to the note
    <Date>      <Authors Name>     <Brief Description of Change>
    5/07/2017     Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    save : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var body = component.find("body");
                var subject = component.find("subject");
                if ((subject.get("v.value") == null) || (subject.get("v.value") == '')) {
                    subject.showHelpMessageIfInvalid();
                }
                if ((subject.get("v.value") != null)  && (subject.get("v.value") != ''))  {
                    var action = component.get("c.saveNote");
                    action.setParams({
                        "recId": component.get("v.id"),
                        "body": body.get("v.value"),
                        "subject": subject.get("v.value")
                    });
                    action.setCallback(this, function(a) {
                        if (a.getState() === "SUCCESS") {
                        } 
                        else if (a.getState() === "ERROR") {
                            $A.log("Errors", a.getError());
                        }
                        var spinner = component.find("spinner");
                        $A.util.addClass(spinner, "slds-hide");
                        var overlay = component.find("overlay");
                        $A.util.addClass(overlay, "slds-hide");
                        component.find("subject").set("v.value", "");
                        component.find("body").set("v.value", "");
                        var finishEvent = component.getEvent("NoteEditFinish");
                        finishEvent.fire();
                        component.set("v.showNotes", true);
                    });
                    var spinner = component.find("spinner");
                    $A.util.removeClass(spinner, "slds-hide");
                    $A.enqueueAction(action);
                }
            } else {
                console.error('No Internet Connection');
            }
        } catch(e){
            console.error(e);
        }
    }
})