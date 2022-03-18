({
    doInit : function(cmp, event, helper) {
        console.log(cmp.get("v.ifmsrc"));
        console.log('in component');
        var ios = $A.get("$Browser.isIOS");
        var android = $A.get("$Browser.isAndroid");
        var federationId='';
        var getFederationId = cmp.get("c.getUserSAMLId");
            getFederationId.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(ios || android){
                    cmp.set('v.ifmsrc',$A.get("$Label.c.PvP_SRL_Mobile")+response.getReturnValue());
                    var dashboard = cmp.find('TheNumbersDashboardHomePageSRL');
                    $A.util.addClass(dashboard, 'maxHeight');
                } else {
                    cmp.set('v.ifmsrc',$A.get("$Label.c.PvP_SRL_Desktop")+response.getReturnValue());
                }
                console.log(cmp.get("v.ifmsrc"));
                console.log('in component');
                console.log('state', state);
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
            
        });
        
        $A.enqueueAction(getFederationId);
        
    }
}
})