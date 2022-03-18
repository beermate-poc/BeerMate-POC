({
    doInit : function(component, event, helper) {
        var salesRegionDesc='';
        var mgmtUnitDesc='';
        var action = component.get("c.getUserInfo");
            action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var userObj = response.getReturnValue();
                if(userObj.Region__c != null){
                    salesRegionDesc = userObj.Region__c + ' Region';
                } else {
                    salesRegionDesc = '';
                }
                if(userObj.Management_Unit__c != null){
                    mgmtUnitDesc = userObj.Management_Unit__c;
                } else {
                    mgmtUnitDesc = '';
                }
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
            
                component.set('v.ifmsrc',$A.get("$Label.c.Leadership_Mobile") + '&SalesRegionDesc=' + salesRegionDesc + '&MgmtUnitDesc=' + mgmtUnitDesc);
            
        });
        
        $A.enqueueAction(action);
        
    }

})