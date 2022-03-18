({
    doInit : function(cmp, event, helper) {
      var federationId='';
      console.log('src' + cmp.get('v.ifmsrc'));
        var ios = $A.get("$Browser.isIOS");
        var android = $A.get("$Browser.isAndroid");
        var getFederationId = cmp.get("c.getUserSAMLId");
            getFederationId.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(ios || android){
                    cmp.set('v.ifmsrc',$A.get("$Label.c.PvP_SR_Mobile")+response.getReturnValue());
                    var dashboard = cmp.find('TheNumbersDashboardHomePageSR');
                    $A.util.addClass(dashboard, 'maxHeight');
                } else {
                    cmp.set('v.ifmsrc',$A.get("$Label.c.PvP_SR_Desktop")+response.getReturnValue());
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
            
        });
        
        $A.enqueueAction(getFederationId);
        
    }
}
})