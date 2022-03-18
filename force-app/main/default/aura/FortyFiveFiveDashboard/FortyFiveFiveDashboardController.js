({
    doInit : function(component, event, helper) {
        var userId='';
        var ios = $A.get("$Browser.isIOS");
        var android = $A.get("$Browser.isAndroid");
        var getUserID = component.get("c.getUserId");
            getUserID.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                userId = response.getReturnValue();
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
            if(ios || android){
                component.set('v.ifmsrc',$A.get("$Label.c.X45_5_5_SR_Mobile")+userId);
            } else {
                component.set('v.ifmsrc',$A.get("$Label.c.X45_5_5_SR_Desktop")+userId);
            }
        });
        
        $A.enqueueAction(getUserID);
        
    }

})