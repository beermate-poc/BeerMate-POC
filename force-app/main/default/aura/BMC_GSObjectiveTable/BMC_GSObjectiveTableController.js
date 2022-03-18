({
	init: function (component, event, helper) {
       helper.GetPermissionSet(component, event, helper);
        window.addEventListener("message", function(event) {
            component.set("v.showGuidedSellingComponent",true);
            component.set("v.showDashboard",false);          
        }, false);
    },
   NavigateToSellingStoryDB : function(cmp, event) {
       var DashboardUrl  = '/apex/GS_Selling_Story_Dashboard?external-id=' + event.getSource().get("v.value") ;     
       var cmpEvent = cmp.getEvent("SellingDashboardEvent");
            cmpEvent.setParams({
                        "DashboardLink" : DashboardUrl,
                         "showDashboard"    : true
            });
     cmpEvent.fire();
            
         	
    },   
    createObjective : function(component, event, helper) {
        var labelVal = event.getSource().get("v.title");
		var recVal = event.getSource().get("v.name");
        var brandPack = '';
        if(component.get("v.isOffPrem")){
            brandPack = recVal.Brand__c+' - '+recVal.Package__c;
           }else{
           	brandPack = recVal.Brand_Package__c;
           }
        console.log(recVal.Brand_Package__c);
        try{
            if(navigator.onLine){
                switch (labelVal) {
                    case $A.get("$Label.c.BMC_GSSKUObjectName"):
                        var appEvent = $A.get("e.c:BMC_ObjectiveEvent");
                        appEvent.setParams({
                            "showCreateObj" : true,
                            "objectName"	: $A.get("$Label.c.BMC_GSSKUObjectName")+' '+brandPack,
                            "smartSkuOpp"   : recVal,
                            "isOffPrem"		: component.get("v.isOffPrem")
                        });
                        appEvent.fire();
                        break;
                    case $A.get("$Label.c.BMC_GSChainObjectName"):
                        var appEvent = $A.get("e.c:BMC_ObjectiveEvent");
                        appEvent.setParams({
                            "showCreateObj" : true,
                            "objectName"	:$A.get("$Label.c.BMC_GSChainObjectName"),
                            "chainMandate"   : recVal,
                            "isOffPrem"		: component.get("v.isOffPrem")
                        });
                        appEvent.fire();
                        break;
                }
            } else {
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');      
            }
        } catch(e){
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }	
	}
})