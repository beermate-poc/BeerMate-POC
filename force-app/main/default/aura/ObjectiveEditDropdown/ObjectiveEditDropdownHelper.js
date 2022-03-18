({
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Creates a toast msg on the page

    History
    <Date>       <Authors Name>         <Brief Description of Change>
    3/29/2018   Jacqueline Passehl       Initial Creation
    ------------------------------------------------------------*/
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
    },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Calls apex method to delete objective

    History
    <Date>       <Authors Name>         <Brief Description of Change>
    3/29/2018   Jacqueline Passehl       Initial Creation
    ------------------------------------------------------------*/
    initiateDelete: function(component,event,helper){

        var action = component.get("c.deleteObjective");
        action.setParams({
            "objectiveId" : component.get("v.objective.Id"),
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Objective_Delete_Success"), 'success');
                $A.get('e.force:refreshView').fire();
            } else {
                var errors = a.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + 
                            errors[0].message);
                    }
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);

    }
})