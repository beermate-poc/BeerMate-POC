({
	/*
	 * Removes slds-hide
	 */
    showSpinner : function(component, event, helper) {
      $A.util.removeClass(component.find("divspn") , "slds-hide"); 
      $A.util.removeClass(component.find("spn") , "slds-hide");  
    },
    /*
	 * adds slds-hide
	 */
    hideSpinner : function(component, event, helper) {
      $A.util.addClass(component.find("divspn") , "slds-hide");
      $A.util.addClass(component.find("spn") , "slds-hide");
    }
})