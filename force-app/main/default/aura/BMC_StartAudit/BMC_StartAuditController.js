({
    doInit : function(component, event, helper) {
        var toDay =  new Date();
        component.set('v.today', toDay);
        helper.getAccountInfo(helper, component, event);
        helper.getDistributor(helper, component, event);
    },
    backtoRecordpg: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire() ;
    },
    saveretailAudit: function(component, event, helper) {
        if( $A.util.isEmpty(component.find("auditDate").get("v.value"))){
            var dateError=$A.get("$Label.c.BMC_AuditDateError");
            helper.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_AuditDateError"), 'slds-theme_error');  
        } 
       
        else if(( component.find("distributorId").get("v.value")===$A.get("$Label.c.BMC_SelectDistributor") ) || ( $A.util.isEmpty(component.find("distributorId").get("v.value")))){
            var distrubutorError=$A.get("$Label.c.BMC_DistributorError");
            helper.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_DistributorError"), 'slds-theme_error');  
        }
        else{
            component.set("v.showSpinner", true);
            helper.findRetailaduitrecord(helper, component, event);         
        }
    }
})