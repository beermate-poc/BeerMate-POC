({
	doInit : function(component, event, helper) {
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        $A.util.removeClass(component.find("divspn") , "slds-hide");
        
        helper.getCalculator(component, event, helper);
        
		
	},
    handleCancel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
        $A.get('e.force:refreshView').fire();
	},
    onSave : function(component, event, helper) {
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        $A.util.removeClass(component.find("divspn") , "slds-hide");
        
        helper.saveChanges(component, event, helper);
        
		
	}
})