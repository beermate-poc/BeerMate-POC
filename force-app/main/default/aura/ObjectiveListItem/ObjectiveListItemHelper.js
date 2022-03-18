({
    /*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   sets attributes to support showing the correct objective apply view 

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
    navigateToComponent : function(component, event){
        try{
            var objectiveId = component.get("v.objective.Id");
            if(objectiveId.indexOf('share') > -1 && objectiveId != null){
                objectiveId = objectiveId.substring(0, objectiveId.length - 5);
                component.set("v.sharedObjective", true);
                component.set("v.objectiveId", objectiveId);
                // MC-1738: Added to close and modal and Retain User State
                if($A.get("$Browser.formFactor") == 'DESKTOP'){
                    component.set("v.showMyObjectives", true);
                }
                else{
                    component.set("v.showMyObjectives", false);
                }
                component.set("v.showApplyObjectives", true);
            } else {
                if(objectiveId != null){
                    component.set("v.objectiveId", objectiveId);
                    // MC-1738: Added to close and modal and Retain User State
                    if($A.get("$Browser.formFactor") == 'DESKTOP'){
                        component.set("v.showMyObjectives", true);
                    }
                    else{
                        component.set("v.showMyObjectives", false);
                    }
                    component.set("v.showApplyObjectives", true);
                }
            }
        } catch(e){
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['Duration'] = duration
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    }
})