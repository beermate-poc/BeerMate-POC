({
	 /*------------------------------------------------------------
              Author:        Bryant Daniels
              Company:       Slalom, LLC
              Description:   displays toast for dekstop
              <Date>      <Authors Name>     <Brief Description of Change>
              5/07/2017    Bryant Daniels     Initial Creation
              ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toastMsg
            if (toastMsg) {
                //fire the toastMsg event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
    },
    GetPermissionSet: function(component,event,helper){
    var action = component.get("c.getUserPermissionSet");
    action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                component.set("v.PermSet",a.getReturnValue());
                var SellingStoryDBURL = $A.get("$Label.c.GS_Selling_Story_Label");
                component.set("v.SellingStoryDashboard", SellingStoryDBURL);
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