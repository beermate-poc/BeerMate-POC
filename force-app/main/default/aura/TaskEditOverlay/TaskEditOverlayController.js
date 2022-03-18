({
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   hides spinner
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Brian Mansfield     Initial Creation
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
    Description:   shows panel to edit todo
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Brian Mansfield     Initial Creation
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
                var subject = component.find("subject");
                var action = component.get("c.getTask");
                action.setParams({ recId : component.get("v.id") });
                action.setCallback(this, function(data) {
                    if(data.getState() === "SUCCESS"){
                        var task = data.getReturnValue();
                        component.find("subject").set("v.value", task.Subject);
                        component.find("editDatepicker").set("v.value", task.ActivityDate);
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
    Description:   hides panel
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    hidePanel : function(component, event, helper) {
        var overlay = component.find("overlay");
        $A.util.addClass(overlay, "slds-hide");
        component.find("subject").set("v.value", "");
        component.find("editDatepicker").set("v.value", "");
        component.set("v.showToDos", true);
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   saves edited todo
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    save : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var date = component.find("editDatepicker");
                var subject = component.find("subject");
                if ((date.get("v.value") == null) || (date.get("v.value") == '')) {
                    date.set("v.errors", [{message:"Due date is required."}])
                }
                if ((subject.get("v.value") == null) || (subject.get("v.value") == '')) {
                    subject.showHelpMessageIfInvalid();
                }
                var currInput = date.get("v.value");
                var listString = currInput.split('-');
                if (listString.length > 0) {
                    var allValid = true;
                    for (var i = 0; i < listString.length; i++) { 
                        if (isNaN(listString[i])) {
                            allValid = false;
                        }
                    }
                    if (!allValid) {
                        date.set("v.errors", [{message:"Enter a date in the format M/D/YYYY"}]);
                    }
                    else {
                        date.set("v.errors", [{message:null}]);
                    }
                }
                if ((subject.get("v.value") != null) && (date.get("v.value") != null) && (date.get("v.value") != '') && (subject.get("v.value") != '') && (allValid))  {
                    var action = component.get("c.saveTask");
                    action.setParams({
                        "recId": component.get("v.id"),
                        "dateInput": component.find("editDatepicker").get("v.value"),
                        "subject": component.find("subject").get("v.value")
                    });
                    action.setCallback(this, function(a) {
                        if (a.getState() === "SUCCESS") {
                            date.set("v.errors", null)
                        } 
                        else if (a.getState() === "ERROR") {
                            $A.log("Errors", a.getError());
                        }
                        var spinner = component.find("spinner");
                        $A.util.addClass(spinner, "slds-hide");
                        var overlay = component.find("overlay");
                        $A.util.addClass(overlay, "slds-hide");
                        component.find("subject").set("v.value", "");
                        component.find("editDatepicker").set("v.value", "");
                        var finishEvent = component.getEvent("TaskEditFinish");
                        finishEvent.fire();
                        component.set("v.showToDos", true);
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