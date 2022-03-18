({
    doInit : function(component, event, helper) {
        helper.getAccountInfo(component , event, helper);
    },
    
	openOutletSelection : function(component, event, helper) {
        var pageReference = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__BMC_CA_Outlet_Selection_Table'
            },
            state: {
                "c__recordId": component.get("v.recordId")
            }
        }
        component.set("v.pageReference", pageReference);
        
        var navService = component.find("navService");
        var pageReference = component.get("v.pageReference");
        event.preventDefault();
        navService.navigate(pageReference);
		//helper.openOutletSelection(component,event,helper);
	},
    openProdSelection : function(component, event, helper) {
        helper.openProdSelection(component, event, helper);
    },
    
    uploadCAOutlet : function(component, event, helper) {
		helper.uploadCAOutlet(component, event, helper);
	}
    
})